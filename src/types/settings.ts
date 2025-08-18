export interface PracticeSettings {
  isShuffle: boolean
  hiddenInCard: ('phonetic' | 'word' | 'definition')[]
  isAutoPlayAudio: boolean
}

export interface SpeechSettings {
  language: string
  rate: number // 0.1 - 10
  pitch: number // 0 - 2
  volume: number // 0 - 1
  voice?: string
}

export interface TransferSettings {
  importStrategy: 'overwrite' | 'merge'
  iceServers: Array<{ urls: string[]; username?: string; credential?: string }>
}

export interface AppSettings {
  practice: PracticeSettings
  speech: SpeechSettings
  transfer: TransferSettings
}
