import { FlashCardItemNameMap } from '@/constants/flashCard'

export type CardRevealState = Record<keyof typeof FlashCardItemNameMap, boolean>
