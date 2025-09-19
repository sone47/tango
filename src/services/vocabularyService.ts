import { getGlobalIDBManager } from '@/hooks/useDatabase'
import { type VocabularyEntity, vocabularySchema } from '@/schemas'

export class VocabularyService {
  private get vocabularyRepo() {
    return getGlobalIDBManager().getRepository<VocabularyEntity>(vocabularySchema)
  }

  /**
   * 根据词汇ID获取词汇
   */
  async getVocabularyById(vocabularyId: number): Promise<VocabularyEntity | null> {
    try {
      const vocabulary = await this.vocabularyRepo.findById(vocabularyId)
      return vocabulary || null
    } catch (error) {
      console.error('获取词汇失败:', error)
      return null
    }
  }

  /**
   * 根据词汇ID列表批量获取词汇
   */
  async getVocabulariesByIds(vocabularyIds: number[]): Promise<VocabularyEntity[]> {
    try {
      if (!vocabularyIds.length) return []

      const vocabularies = await Promise.all(
        vocabularyIds.map(async (vocabularyId) => {
          const vocabulary = await this.getVocabularyById(vocabularyId)
          return vocabulary
        })
      )

      return vocabularies.filter(Boolean) as VocabularyEntity[]
    } catch (error) {
      console.error('批量获取词汇失败:', error)
      return []
    }
  }

  async getWordsByCardPackId(cardPackId: number): Promise<VocabularyEntity[]> {
    try {
      const vocabularies = await this.vocabularyRepo.findBy('cardPackId', cardPackId)
      return vocabularies.sort((a, b) => a.order - b.order)
    } catch (error) {
      console.error('获取词汇失败:', error)
      return []
    }
  }

  async getWordCountByCardPackId(cardPackId: number): Promise<number> {
    try {
      const count = await this.vocabularyRepo.count('cardPackId', cardPackId)
      return count
    } catch (error) {
      console.error('获取词汇数量失败:', error)
      return 0
    }
  }

  async updateVocabulary(
    vocabularyId: number,
    data: Partial<VocabularyEntity>
  ): Promise<VocabularyEntity | null> {
    try {
      const existingVocabulary = await this.vocabularyRepo.findById(vocabularyId)
      if (!existingVocabulary) {
        console.error('词汇不存在:', vocabularyId)
        return null
      }

      const updatedData = {
        ...existingVocabulary,
        ...data,
        id: vocabularyId,
        updatedAt: new Date().toISOString(),
      }

      const updatedVocabulary = await this.vocabularyRepo.save(updatedData)
      return updatedVocabulary
    } catch (error) {
      console.error('更新词汇失败:', error)
      return null
    }
  }

  async createVocabulary(
    data: Omit<VocabularyEntity, 'id' | 'order' | 'createdAt' | 'updatedAt'>
  ): Promise<VocabularyEntity | null> {
    try {
      const newVocabulary = {
        ...data,
        order: await this.getNextOrderInCardPack(data.cardPackId),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      const savedVocabulary = await this.vocabularyRepo.save(newVocabulary)
      return savedVocabulary
    } catch (error) {
      console.error('创建词汇失败:', error)
      return null
    }
  }

  async deleteVocabulary(vocabularyId: number) {
    await getGlobalIDBManager().transaction(
      ['practices', 'vocabularies'],
      'readwrite',
      async (stores) => {
        const practiceStore = stores['practices']
        const vocabularyStore = stores['vocabularies']

        const practice = await practiceStore.index('vocabularyId').get(vocabularyId)
        if (practice) {
          await practiceStore.delete(practice.id)
        }
        await vocabularyStore.delete(vocabularyId)
      }
    )
  }

  /**
   * 获取卡包中下一个order值（最后一张卡片的order + 1）
   */
  async getNextOrderInCardPack(cardPackId: number): Promise<number> {
    try {
      const vocabularies = await this.vocabularyRepo.findBy('cardPackId', cardPackId)
      if (vocabularies.length === 0) {
        return 0
      }

      const maxOrder = Math.max(...vocabularies.map((v) => v.order))
      return maxOrder + 1
    } catch (error) {
      console.error('获取下一个order值失败:', error)
      return 0
    }
  }

  /**
   * 批量更新词汇的order
   */
  async updateVocabulariesOrder(vocabularyIds: number[]): Promise<void> {
    try {
      await getGlobalIDBManager().transaction(['vocabularies'], 'readwrite', async (stores) => {
        const vocabularyStore = stores['vocabularies']

        for (let i = 0; i < vocabularyIds.length; i++) {
          const vocabularyId = vocabularyIds[i]
          const vocabulary = await vocabularyStore.get(vocabularyId)
          if (vocabulary) {
            vocabulary.order = i
            vocabulary.updatedAt = new Date().toISOString()
            await vocabularyStore.put(vocabulary)
          }
        }
      })
    } catch (error) {
      console.error('批量更新词汇order失败:', error)
      throw error
    }
  }

  /**
   * 移动词汇到另一个卡包，并设置在目标卡包的最后
   */
  async moveVocabularyToCardPack(
    vocabularyId: number,
    targetCardPackId: number
  ): Promise<VocabularyEntity | null> {
    try {
      let order = await this.getNextOrderInCardPack(targetCardPackId)
      if (isNaN(order)) {
        const vocabulary = await this.getWordsByCardPackId(targetCardPackId)
        await this.updateVocabulariesOrder(vocabulary.map((v) => v.id))
        order = await this.getNextOrderInCardPack(targetCardPackId)
      }

      return await this.updateVocabulary(vocabularyId, {
        cardPackId: targetCardPackId,
        order,
      })
    } catch (error) {
      console.error('移动词汇失败:', error)
      return null
    }
  }
}

export const vocabularyService = new VocabularyService()
