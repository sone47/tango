import { invert, isNil } from 'lodash'

import { LanguageEnum, PartOfSpeechEnum, partOfSpeechToLanguageMap } from '@/constants/language'
import { getGlobalIDBManager } from '@/hooks/useDatabase'
import type { CardPackEntity, VocabularyEntity, WordPackEntity } from '@/schemas'
import { cardPackSchema, vocabularySchema, wordPackSchema } from '@/schemas'
import type { ExcelParseResult } from '@/utils/excel'
import { isValidExcelFile, parseExcelFile } from '@/utils/excel'

// 词包导入专用的 Excel 行数据接口
export interface WordPackExcelRow {
  音标?: string
  写法: string
  释义: string
  例句?: string
  卡包名: string
  词汇音频?: string
  例句音频?: string
}

// 解析后的词包数据结构
export interface ParsedWordPackData {
  wordPackName: string
  cardPacks: {
    name: string
    vocabularies: {
      phonetic?: string
      word?: string
      definition?: string
      partOfSpeech?: PartOfSpeechEnum
      example?: string
      wordAudio?: string
      exampleAudio?: string
    }[]
  }[]
}

// 验证结果
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

// 导入结果接口
export interface ImportResult {
  success: boolean
  message: string
  wordPackId?: number
  stats?: {
    cardPackCount: number
    vocabularyCount: number
  }
  errors?: string[]
}

export const ExcelToDataFieldMap = {
  音标: 'phonetic',
  写法: 'word',
  释义: 'definition',
  词性: 'partOfSpeech',
  例句: 'example',
  卡包名: 'cardPackName',
  词汇音频: 'wordAudio',
  例句音频: 'exampleAudio',
}

/**
 * 词包服务类
 * 负责词包的导入、解析、验证等操作
 */
export class WordPackService {
  private get wordPackRepo() {
    return getGlobalIDBManager().getRepository<WordPackEntity>(wordPackSchema)
  }

  private get cardPackRepo() {
    return getGlobalIDBManager().getRepository<CardPackEntity>(cardPackSchema)
  }

  private get vocabularyRepo() {
    return getGlobalIDBManager().getRepository<VocabularyEntity>(vocabularySchema)
  }

  /**
   * 完整的导入流程：解析 + 验证 + 导入
   * @param file Excel 文件
   * @returns 导入结果
   */
  async importFromExcel(
    file: File,
    wordPackName?: string,
    language: LanguageEnum = LanguageEnum.ja
  ): Promise<ImportResult> {
    try {
      // 1. 解析 Excel 文件
      const parsedData = await this.parseExcel(file, language)

      // 2. 验证数据
      const validation = this.validateData(parsedData)
      if (!validation.isValid) {
        return {
          success: false,
          message: '文件数据验证失败',
          errors: validation.errors,
        }
      }

      // 3. 导入数据
      const result = await this.importData(parsedData, wordPackName, language)
      return result
    } catch (error) {
      console.error('词包导入失败:', error)

      return {
        success: false,
        message: `导入失败：${error instanceof Error ? error.message : '未知错误'}`,
        errors: [error instanceof Error ? error.message : '未知错误'],
      }
    }
  }

  /**
   * 解析词包 Excel 文件
   * @param file Excel 文件
   * @returns 解析后的词包数据
   */
  async parseExcel(file: File, language: LanguageEnum): Promise<ParsedWordPackData> {
    // 1. 验证文件类型
    if (!isValidExcelFile(file)) {
      throw new Error('请选择有效的 Excel 文件（.xlsx 或 .xls）')
    }

    // 2. 解析 Excel 文件
    const parseResult: ExcelParseResult = await parseExcelFile(file)

    if (parseResult.data.length === 0) {
      throw new Error('Excel 文件没有有效数据')
    }

    // 3. 转换数据格式
    const excelData = parseResult.data as WordPackExcelRow[]

    // 4. 解析数据
    const parsedData = this.parseVocabularyData(excelData, file.name, language)

    return parsedData
  }

  /**
   * 验证解析后的词包数据
   * @param data 解析后的数据
   * @returns 验证结果
   */
  validateData(data: ParsedWordPackData): ValidationResult {
    const errors: string[] = []

    // 验证词包名
    if (!data.wordPackName.trim()) {
      errors.push('词包名不能为空')
    }

    // 验证卡包
    if (data.cardPacks.length === 0) {
      errors.push('至少需要一个卡包')
    }

    data.cardPacks.forEach((cardPack, cardIndex) => {
      // 验证卡包名
      if (!cardPack.name.trim()) {
        errors.push(`第 ${cardIndex + 1} 个卡包名称不能为空`)
      }

      // 验证词汇数量
      if (cardPack.vocabularies.length === 0) {
        errors.push(`卡包 "${cardPack.name}" 没有词汇数据`)
      }

      // 验证词汇内容
      cardPack.vocabularies.forEach((vocab, vocabIndex) => {
        if (!vocab.word?.trim()) {
          errors.push(`卡包 "${cardPack.name}" 第 ${vocabIndex + 1} 行的写法不能为空`)
        }
        if (!vocab.definition?.trim()) {
          errors.push(`卡包 "${cardPack.name}" 第 ${vocabIndex + 1} 行的释义不能为空`)
        }
        if (isNil(vocab.partOfSpeech)) {
          errors.push(`卡包 "${cardPack.name}" 第 ${vocabIndex + 1} 行的词性非法`)
        }
      })
    })

    return {
      isValid: !errors.length,
      errors,
    }
  }

  /**
   * 导入词包数据到 IndexedDB
   * 使用事务确保数据一致性
   * @param parsedData 解析后的词包数据
   * @returns 导入结果
   */
  async importData(
    parsedData: ParsedWordPackData,
    wordPackName?: string,
    language?: LanguageEnum
  ): Promise<ImportResult> {
    try {
      // 使用事务执行完整的导入操作，确保数据一致性
      const result = await getGlobalIDBManager().transaction(
        ['wordPacks', 'cardPacks', 'vocabularies'],
        'readwrite',
        async (stores) => {
          const wordPackStore = stores['wordPacks']
          const cardPackStore = stores['cardPacks']
          const vocabularyStore = stores['vocabularies']

          // 1. 在事务内检查词包名是否已存在（避免竞态条件）
          const name = wordPackName || parsedData.wordPackName
          const nameIndex = wordPackStore.index('name')
          const existingWordPack = await nameIndex.get(name)
          if (existingWordPack) {
            throw new Error(`词包 "${name}" 已存在，请使用不同的名称`)
          }

          // 2. 创建词包记录
          const wordPackData = {
            name,
            language,
          }
          const wordPackWithTimestamps = this.wordPackRepo.addTimestamps(wordPackData, false)
          const wordPackId = await wordPackStore.add(wordPackWithTimestamps)

          let totalVocabularyCount = 0

          // 3. 创建卡包和词汇记录
          for (const cardPackData of parsedData.cardPacks) {
            // 创建卡包记录
            const cardPack = {
              wordPackId: wordPackId as number,
              name: cardPackData.name,
            }
            const cardPackWithTimestamps = this.cardPackRepo.addTimestamps(cardPack, false)
            const cardPackId = await cardPackStore.add(cardPackWithTimestamps)

            // 批量创建词汇记录
            for (const vocabularyData of cardPackData.vocabularies) {
              const vocabulary = {
                cardPackId: cardPackId as number,
                phonetic: vocabularyData.phonetic || '',
                word: vocabularyData.word || '',
                definition: vocabularyData.definition || '',
                partOfSpeech: vocabularyData.partOfSpeech,
                example: vocabularyData.example || '',
                wordAudio: vocabularyData.wordAudio || '',
                exampleAudio: vocabularyData.exampleAudio || '',
              }
              const vocabularyWithTimestamps = this.vocabularyRepo.addTimestamps(vocabulary, false)
              await vocabularyStore.add(vocabularyWithTimestamps)
              totalVocabularyCount++
            }
          }

          return {
            wordPackId: wordPackId as number,
            cardPackCount: parsedData.cardPacks.length,
            vocabularyCount: totalVocabularyCount,
          }
        }
      )

      return {
        success: true,
        message: `成功导入词包 "${parsedData.wordPackName}"`,
        wordPackId: result.wordPackId,
        stats: {
          cardPackCount: result.cardPackCount,
          vocabularyCount: result.vocabularyCount,
        },
      }
    } catch (error) {
      console.error('导入词包数据失败:', error)

      // 检查是否是重复名称错误
      const isDuplicateError = error instanceof Error && error.message.includes('已存在')

      return {
        success: false,
        message: `导入失败：${error instanceof Error ? error.message : '未知错误'}`,
        errors: [error instanceof Error ? error.message : '未知错误'],
        ...(isDuplicateError && { wordPackId: undefined }), // 重复错误时不返回ID
      }
    }
  }

  /**
   * 解析词汇数据，按卡包分组
   * @param excelData Excel 解析的原始数据
   * @param fileName 文件名，用作词包名
   * @returns 解析后的词包数据
   */
  private parseVocabularyData(
    excelData: WordPackExcelRow[],
    fileName: string,
    language: LanguageEnum
  ): ParsedWordPackData {
    const wordPackName = fileName.replace(/\.(xlsx?|xls)$/i, '')

    const cardPackMap = new Map<string, WordPackExcelRow[]>()

    excelData.forEach((row) => {
      const cardPackName = String(row.卡包名 || '').trim()

      if (!cardPackMap.has(cardPackName)) {
        cardPackMap.set(cardPackName, [])
      }
      cardPackMap.get(cardPackName)!.push(row)
    })

    const partOfSpeechMap = invert(partOfSpeechToLanguageMap[language] as Record<string, string>)

    // 转换为最终数据结构
    const cardPacks = Array.from(cardPackMap.entries()).map(([cardPackName, vocabularies]) => ({
      name: cardPackName,
      vocabularies: vocabularies.map((vocab) => {
        const rawData = Object.fromEntries(
          Object.entries(ExcelToDataFieldMap).map(([key, value]) => [
            value,
            String((vocab[key as keyof WordPackExcelRow] as string) || '').trim(),
          ])
        ) as ParsedWordPackData['cardPacks'][number]['vocabularies'][number]

        return {
          ...rawData,
          partOfSpeech: rawData.partOfSpeech
            ? (+partOfSpeechMap[rawData.partOfSpeech] as PartOfSpeechEnum)
            : PartOfSpeechEnum.unknown,
        }
      }),
    }))

    return {
      wordPackName,
      cardPacks,
    }
  }

  /**
   * 获取词包列表（支持排序和限制）
   * @param options 查询选项
   * @returns 词包列表
   */
  async getWordPacksBy(options?: {
    orderBy?: {
      field: 'createdAt' | 'name'
      direction: 'asc' | 'desc'
    }
    limit?: number
  }): Promise<WordPackEntity[]> {
    try {
      if (!options) {
        // 无参数时返回所有词包
        return await this.wordPackRepo.findAll()
      }

      const queryOptions: {
        orderBy?: {
          field: string
          direction: 'asc' | 'desc'
        }
        limit?: number
      } = {}

      if (options.orderBy) {
        queryOptions.orderBy = options.orderBy
      }

      if (options.limit) {
        queryOptions.limit = options.limit
      }

      return await this.wordPackRepo.findAll(queryOptions)
    } catch (error) {
      console.error('获取词包列表失败:', error)
      return []
    }
  }

  /**
   * 根据ID获取词包
   * @param wordPackId 词包ID
   * @returns 词包实体
   */
  async getWordPackById(wordPackId: number): Promise<WordPackEntity | null> {
    try {
      const wordPack = await this.wordPackRepo.findById(wordPackId)
      return wordPack || null
    } catch (error) {
      console.error('获取词包失败:', error)
      return null
    }
  }

  /**
   * 检查是否有词包数据
   * @returns 是否有数据
   */
  async hasData(): Promise<boolean> {
    try {
      const count = await this.wordPackRepo.count()
      return count > 0
    } catch (error) {
      console.error('检查词包数据失败:', error)
      return false
    }
  }

  async deleteWordPack(wordPackId: number): Promise<void> {
    try {
      await getGlobalIDBManager().transaction(
        ['wordPacks', 'cardPacks', 'vocabularies', 'practices'],
        'readwrite',
        async (stores) => {
          const wordPackStore = stores['wordPacks']
          const cardPackStore = stores['cardPacks']
          const vocabularyStore = stores['vocabularies']
          const practiceStore = stores['practices']

          // delete word pack
          await wordPackStore.delete(wordPackId)

          const cardPacks = await cardPackStore.index('wordPackId').getAll(wordPackId)

          for (const cardPack of cardPacks) {
            const vocabularies = await vocabularyStore.index('cardPackId').getAll(cardPack.id)
            for (const vocabulary of vocabularies) {
              // delete practices
              const practice = await practiceStore.index('vocabularyId').get(vocabulary.id)
              if (practice) {
                await practiceStore.delete(practice.id)
              }
              // delete vocabularies
              await vocabularyStore.delete(vocabulary.id)
            }

            // delete card packs
            await cardPackStore.delete(cardPack.id)
          }
        }
      )
    } catch (error) {
      console.error('删除词包失败:', error)
      throw error
    }
  }
}

export const wordPackService = new WordPackService()
