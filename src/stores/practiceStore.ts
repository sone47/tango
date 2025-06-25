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
  showSwitchConfirm: boolean
  tempSelectedCardPack: CardPack | null
  pendingConfigAction: { shuffle: boolean; proficiency: number } | null
  revealState: CardRevealState
}

interface PracticeActions {
  updateState: (updates: Partial<PracticeState>) => void
  resetRevealState: () => void
  isInProgress: () => boolean
  resetPracticeState: () => void
}

const initialState: PracticeState = {
  selectedCardPack: null,
  proficiency: 50,
  currentWordIndex: 0,
  shuffledWords: [],
  studiedWords: [],
  showCardPackSelector: false,
  showHistoryPool: false,
  showCardPackConfig: false,
  showSwitchConfirm: false,
  tempSelectedCardPack: null,
  pendingConfigAction: null,
  revealState: { phonetic: false, word: false, definition: false },
}

export const usePracticeStore = create<PracticeState & PracticeActions>((set, get) => ({
  ...initialState,

  updateState: (updates) => set((state) => ({ ...state, ...updates })),

  resetRevealState: () =>
    set((state) => ({
      ...state,
      revealState: { phonetic: false, word: false, definition: false },
    })),

  isInProgress: () => {
    const { selectedCardPack, shuffledWords, currentWordIndex } = get()
    return !!(
      selectedCardPack &&
      shuffledWords.length > 0 &&
      currentWordIndex < shuffledWords.length
    )
  },

  resetPracticeState: () => set(initialState),
}))
