import { getGlobalIDBManager } from '@/hooks/useDatabase'
import type { CardPackEntity, PracticeEntity, VocabularyEntity, WordPackEntity } from '@/schemas'
import { cardPackSchema, practiceSchema, vocabularySchema, wordPackSchema } from '@/schemas'

export type ImportStrategy = 'overwrite' | 'merge'

export interface DataSyncMeta {
  version: number
  exportedAt: string
}

export interface DataSyncPayload {
  meta: DataSyncMeta
  wordPacks: WordPackEntity[]
  cardPacks: CardPackEntity[]
  vocabularies: VocabularyEntity[]
  practices: PracticeEntity[]
}

export class DataSyncService {
  async exportAll(): Promise<DataSyncPayload> {
    const idb = getGlobalIDBManager()
    const wordPackRepo = idb.getRepository<WordPackEntity>(wordPackSchema)
    const cardPackRepo = idb.getRepository<CardPackEntity>(cardPackSchema)
    const vocabularyRepo = idb.getRepository<VocabularyEntity>(vocabularySchema)
    const practiceRepo = idb.getRepository<PracticeEntity>(practiceSchema)

    const [wordPacks, cardPacks, vocabularies, practices] = await Promise.all([
      wordPackRepo.findAll(),
      cardPackRepo.findAll(),
      vocabularyRepo.findAll(),
      practiceRepo.findAll(),
    ])

    return {
      meta: {
        version: 1,
        exportedAt: new Date().toISOString(),
      },
      wordPacks,
      cardPacks,
      vocabularies,
      practices,
    }
  }

  async importAllOverwrite(payload: DataSyncPayload): Promise<void> {
    const idb = getGlobalIDBManager()

    await idb.transaction(
      [practiceSchema.name, vocabularySchema.name, cardPackSchema.name, wordPackSchema.name],
      'readwrite',
      async (stores) => {
        await stores[practiceSchema.name].clear()
        await stores[vocabularySchema.name].clear()
        await stores[cardPackSchema.name].clear()
        await stores[wordPackSchema.name].clear()

        for (const wp of payload.wordPacks) {
          await stores[wordPackSchema.name].put(wp)
        }
        for (const cp of payload.cardPacks) {
          await stores[cardPackSchema.name].put(cp)
        }
        for (const v of payload.vocabularies) {
          await stores[vocabularySchema.name].put(v)
        }
        for (const p of payload.practices) {
          await stores[practiceSchema.name].put(p)
        }
      }
    )
  }
}

export const dataSyncService = new DataSyncService()
