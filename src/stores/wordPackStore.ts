import { create } from 'zustand'

import { wordPackService } from '@/services/wordPackService'
import type { WordPack } from '@/types'

interface WordPackState {
  allWordPacks: WordPack[]
  loading: boolean
  hasData: boolean
  error: string | null
  lastRefreshTime: number
}

interface WordPackActions {
  fetchWordPacks: () => Promise<void>
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  resetState: () => void
}

const initialState: WordPackState = {
  allWordPacks: [],
  loading: false,
  hasData: false,
  error: null,
  lastRefreshTime: 0,
}

export const useWordPackStore = create<WordPackState & WordPackActions>((set, get) => ({
  ...initialState,

  fetchWordPacks: async () => {
    const { loading } = get()
    if (loading) return

    set({ loading: true, error: null })

    try {
      const wordPacks = await wordPackService.getWordPacksBy()
      set({
        allWordPacks: wordPacks,
        hasData: wordPacks.length > 0,
        loading: false,
        error: null,
        lastRefreshTime: Date.now(),
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取词包失败'
      console.error('获取词包失败:', err)
      set({
        allWordPacks: [],
        hasData: false,
        loading: false,
        error: errorMessage,
      })
    }
  },

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  resetState: () => set(initialState),
}))
