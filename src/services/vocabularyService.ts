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
      return vocabularies
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
    data: Omit<VocabularyEntity, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<VocabularyEntity | null> {
    try {
      const newVocabulary = {
        ...data,
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
}

export const vocabularyService = new VocabularyService()
