import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKeys'
import { getGlobalIDBManager } from '@/hooks/useDatabase'
import { LatestData } from '@/hooks/useLastestData'
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
  currentWordPackId: number | null
  latestData: LatestData | null
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

    const currentWordPackIdStr = localStorage.getItem(LOCAL_STORAGE_KEYS.CURRENT_WORD_PACK_ID)
    const currentWordPackId = currentWordPackIdStr ? Number(currentWordPackIdStr) : null
    const latestDataStr = localStorage.getItem(LOCAL_STORAGE_KEYS.LATEST_DATA)
    const latestData = latestDataStr ? (JSON.parse(latestDataStr) as LatestData) : null

    return {
      meta: {
        version: 1,
        exportedAt: new Date().toISOString(),
      },
      wordPacks,
      cardPacks,
      vocabularies,
      practices,
      currentWordPackId,
      latestData,
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

    if (payload.currentWordPackId !== null) {
      localStorage.setItem(
        LOCAL_STORAGE_KEYS.CURRENT_WORD_PACK_ID,
        payload.currentWordPackId.toString()
      )
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.CURRENT_WORD_PACK_ID)
    }

    if (payload.latestData !== null) {
      localStorage.setItem(LOCAL_STORAGE_KEYS.LATEST_DATA, JSON.stringify(payload.latestData))
    } else {
      localStorage.removeItem(LOCAL_STORAGE_KEYS.LATEST_DATA)
    }
  }
}

export const dataSyncService = new DataSyncService()
