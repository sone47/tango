import { VoiceList } from '@lobehub/tts'

import type { AppSettings } from '@/types/settings'

export const defaultSettings = {
  practice: {
    isShuffle: true,
    hiddenInCard: ['phonetic', 'word', 'definition'],
    isAutoPlayAudio: true,
  },
  speech: {
    language: 'zh-CN',
    voice: '',
    rate: 1.0,
  },
  transfer: {
    importStrategy: 'overwrite' as const,
    iceServers: [
      {
        urls: ['stun:stun.l.google.com:19302'],
      },
    ],
  },
  advanced: {
    aiApiKey: '',
  },
} as AppSettings

export const languageOptions = VoiceList.localeOptions as { value: string; label: string }[]
