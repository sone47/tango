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
  transfer: {
    importStrategy: 'overwrite' as const,
    iceServers: [
      {
        urls: [
          'turn:stun.evan-brass.net',
          'turn:stun.evan-brass.net?transport=tcp',
          'stun:stun.evan-brass.net',
        ],
        username: 'guest',
        credential: 'password',
      },
    ],
  },
} as const

// TODO https://github.com/TiagoDanin/Windows-Locale
export const languageOptions = [
  { value: 'zh-CN', label: '中文（普通话）' },
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'ja-JP', label: '日本語' },
]
