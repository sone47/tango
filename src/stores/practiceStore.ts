import { create } from 'zustand'

import type { CardPack, CardRevealState, Word } from '@/types'

interface PracticeState {
  selectedCardPack: CardPack | null
  proficiency: number
  currentWordIndex: number
  shuffledWords: Word[]
  studiedWords: Word[]
  showCardPackSelector: boolean
  showHistoryPool: boolean
  showCardPackConfig: boolean
  tempSelectedCardPack: CardPack | null
  revealState: CardRevealState
}

interface PracticeActions {
  updateState: (updates: Partial<PracticeState>) => void
  resetPracticeState: () => void
}

const initialState: PracticeState = {
  selectedCardPack: null,
  proficiency: 50,
  currentWordIndex: 0,
  shuffledWords: [],
  studiedWords: [],
  showCardPackSelector: true,
  showHistoryPool: false,
  showCardPackConfig: false,
  tempSelectedCardPack: null,
  revealState: { phonetic: false, word: false, definition: false },
}

export const usePracticeStore = create<PracticeState & PracticeActions>((set) => ({
  ...initialState,

  updateState: (updates) => set((state) => ({ ...state, ...updates })),

  resetPracticeState: () => set(initialState),
}))
