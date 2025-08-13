export const LOCAL_STORAGE_KEYS = {
  CURRENT_WORD_PACK_ID: 'tango-current-wordpack-id',
  SETTINGS: 'tango-settings',
} as const

export type LocalStorageKey = (typeof LOCAL_STORAGE_KEYS)[keyof typeof LOCAL_STORAGE_KEYS]
