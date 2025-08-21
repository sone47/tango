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

// TODO https://github.com/TiagoDanin/Windows-Locale
export const languageOptions = [
  { value: 'zh-CN', label: '中文（普通话）' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'ja-JP', label: '日本語' },
]
