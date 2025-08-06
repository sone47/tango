export const defaultSettings = {
  practice: {
    isShuffle: true,
  },
  speech: {
    language: 'zh-CN',
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  },
} as const

export const languageOptions = [
  { value: 'zh-CN', label: '中文（普通话）' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'ja-JP', label: '日本語' },
]
