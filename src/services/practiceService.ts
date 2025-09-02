import { round } from 'lodash'

import { getGlobalIDBManager } from '@/hooks/useDatabase'
import {
  type CardPackEntity,
  cardPackSchema,
  type PracticeEntity,
  practiceSchema,
  type VocabularyEntity,
} from '@/schemas'
import { now, todayRange } from '@/utils/date'

import { vocabularyService } from './vocabularyService'

export class PracticeService {
  private get practiceRepo() {
    return getGlobalIDBManager().getRepository<PracticeEntity>(practiceSchema)
  }

  private get cardPackRepo() {
    return getGlobalIDBManager().getRepository<CardPackEntity>(cardPackSchema)
  }

  async getTodayPractices(): Promise<PracticeEntity[]> {
    try {
      const [todayStart, todayEnd] = todayRange()

      const todayPractices = await this.practiceRepo.findByRange(
        'lastPracticeTime',
        todayStart,
        todayEnd,
        {
          lowerOpen: false,
          upperOpen: false,
        }
      )

      return todayPractices
    } catch (error) {
      console.error('获取今日练习记录失败:', error)
      return []
    }
  }

  async getPracticeByVocabularyId(vocabularyId: number): Promise<PracticeEntity | null> {
    try {
      const practiceEntity = await this.practiceRepo.findOneBy('vocabularyId', vocabularyId)
      if (!practiceEntity) return null

      return practiceEntity
    } catch (error) {
      console.error('获取练习记录失败:', error)
      return null
    }
  }

  async getPracticesByVocabularyIds(vocabularyIds: number[]): Promise<PracticeEntity[]> {
    try {
      if (!vocabularyIds.length) return []

      const practices = await Promise.all(
        vocabularyIds.map(async (vocabularyId) => {
          const practice = await this.getPracticeByVocabularyId(vocabularyId)
          return practice
        })
      )

      return practices.filter(Boolean) as PracticeEntity[]
    } catch (error) {
      console.error('批量获取练习记录失败:', error)
      return []
    }
  }

  async createPracticesForWords(words: VocabularyEntity[]): Promise<PracticeEntity[]> {
    try {
      if (!words.length) return []

      const wordIds = words.map((word) => word.id)

      const existingPractices = await this.getPracticesByVocabularyIds(wordIds)
      const existingPracticeSet = new Set(
        existingPractices.map((practice) => practice.vocabularyId)
      )

      const wordsToCreate = words.filter((word) => !existingPracticeSet.has(word.id))

      if (!wordsToCreate.length) return existingPractices

      const newPracticeEntities = wordsToCreate.map((word) => ({
        vocabularyId: word.id,
        practiceCount: 0,
        proficiency: 0,
      }))

      const savedEntities = await this.practiceRepo.saveMany(newPracticeEntities as any[])

      return [...existingPractices, ...savedEntities]
    } catch (error) {
      console.error('批量创建练习记录失败:', error)
      return []
    }
  }

  async updatePractice(
    vocabularyId: number,
    updates: Partial<Pick<PracticeEntity, 'proficiency' | 'practiceCount'>>
  ): Promise<PracticeEntity | null> {
    try {
      const practiceEntity = await this.practiceRepo.findOneBy('vocabularyId', vocabularyId)
      if (!practiceEntity) {
        console.warn(`找不到单词ID ${vocabularyId} 的练习记录`)
        return null
      }

      const updateData: Partial<PracticeEntity> = {
        lastPracticeTime: now(),
        ...updates,
      }

      updateData.practiceCount = (practiceEntity.practiceCount || 0) + 1

      const updatedEntity = await this.practiceRepo.update(practiceEntity.id, updateData)

      return updatedEntity || null
    } catch (error) {
      console.error('更新练习记录失败:', error)
      return null
    }
  }

  // 算法：total += (word * proficiency), progress = total / word_count_in_wordpack / 100
  async calculateWordPackProgress(wordPackId: number): Promise<number> {
    try {
      const cardPacks = await this.cardPackRepo.findBy('wordPackId', wordPackId)
      if (!cardPacks.length) return 0

      let totalWordsCount = 0
      const practices: PracticeEntity[] = []

      for (const cardPack of cardPacks) {
        const vocabularies = await vocabularyService.getWordsByCardPackId(cardPack.id)
        const vocabularyIds = vocabularies.map((v) => v.id)

        if (!vocabularyIds.length) continue

        const practicesForCardPack = await this.getPracticesByVocabularyIds(vocabularyIds)
        practices.push(...practicesForCardPack)
        totalWordsCount += vocabularies.length
      }

      if (!totalWordsCount) return 0

      return this.calculateProficiency(practices, totalWordsCount)
    } catch (error) {
      console.error('计算词包进度失败:', error)
      return 0
    }
  }

  async calculateCardPackProgress(cardPackId: number): Promise<number> {
    try {
      const vocabularies = await vocabularyService.getWordsByCardPackId(cardPackId)
      const vocabularyIds = vocabularies.map((v) => v.id)

      if (!vocabularyIds.length) return 0

      const practices = await this.getPracticesByVocabularyIds(vocabularyIds)

      return this.calculateProficiency(practices, vocabularies.length)
    } catch (error) {
      console.error('计算卡包进度失败:', error)
      return 0
    }
  }

  private calculateProficiency(practices: PracticeEntity[], vocabularyCount: number): number {
    const totalWeightedProficiency = practices.reduce((acc, curr) => acc + curr.proficiency, 0)

    if (!vocabularyCount) return 0

    return round(totalWeightedProficiency / vocabularyCount / 100, 4)
  }
}

export const practiceService = new PracticeService()
