import { getGlobalIDBManager } from '@/hooks/useDatabase'
import { type CardPackEntity, cardPackSchema, type WordPackEntity, wordPackSchema } from '@/schemas'

import { practiceService } from './practiceService'
import { vocabularyService } from './vocabularyService'

export class CardPackService {
  private get wordPackRepo() {
    return getGlobalIDBManager().getRepository<WordPackEntity>(wordPackSchema)
  }

  private get cardPackRepo() {
    return getGlobalIDBManager().getRepository<CardPackEntity>(cardPackSchema)
  }

  /**
   * 检查是否有数据
   */
  async hasData(): Promise<boolean> {
    const count = await this.wordPackRepo.count()
    return count > 0
  }

  /**
   * 根据词包ID获取卡包列表
   * @param wordPackId 词包ID
   * @returns 卡包基本信息列表
   */
  async getCardPacksByWordPackId(wordPackId: number) {
    try {
      const cardPackEntities = await this.cardPackRepo.findBy('wordPackId', wordPackId)

      if (!cardPackEntities.length) return []

      const cardPacks = await Promise.all(
        cardPackEntities.map(async (entity) => {
          return {
            ...entity,
            words: await vocabularyService.getWordsByCardPackId(entity.id!),
            progress: await practiceService.calculateCardPackProgress(entity.id!),
          }
        })
      )

      return cardPacks
    } catch (error) {
      console.error('获取卡包列表失败:', error)
      return []
    }
  }

  /**
   * 根据卡包ID获取完整的卡包数据（包含单词）
   */
  async getCardPackWithWordsById(cardPackId: number): Promise<CardPackEntity | null> {
    try {
      const cardPack = await this.cardPackRepo.findById(cardPackId)
      if (!cardPack) return null

      return {
        ...cardPack,
        words: await vocabularyService.getWordsByCardPackId(cardPackId),
      }
    } catch (error) {
      console.error('获取完整卡包数据失败:', error)
      return null
    }
  }
}

export const cardPackService = new CardPackService()
