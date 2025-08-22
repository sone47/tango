import { FlashCardItemNameMap } from '@/constants/flashCard'

export interface PracticeSettings {
  isShuffle: boolean
  hiddenInCard: (keyof typeof FlashCardItemNameMap)[]
  isAutoPlayAudio: boolean
}

export interface SpeechSettings {
  language: string
  rate: number // 0-2
  voice?: string
}

export interface TransferSettings {
  importStrategy: 'overwrite' | 'merge'
  iceServers: Array<{ urls: string[]; username?: string; credential?: string }>
}

export interface AdvancedSettings {
  aiApiKey: string
}

export interface AppSettings {
  practice: PracticeSettings
  speech: SpeechSettings
  transfer: TransferSettings
  advanced: AdvancedSettings
}
