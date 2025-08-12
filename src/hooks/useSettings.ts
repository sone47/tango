import { useLocalStorage } from '@uidotdev/usehooks'
import { cloneDeep } from 'lodash'
import { useEffect } from 'react'

import { defaultSettings } from '@/constants/settings'
import { getVoicesByLanguage } from '@/utils/speechUtils'

export interface PracticeSettings {
  isShuffle: boolean
}

export interface SpeechSettings {
  language: string
  rate: number // 0.1 - 10
  pitch: number // 0 - 2
  volume: number // 0 - 1
  voice?: string
}

export interface AppSettings {
  practice: PracticeSettings
  speech: SpeechSettings
  transfer: {
    importStrategy: 'overwrite' | 'merge'
    iceServers: Array<{ urls: string | string[]; username?: string; credential?: string }>
  }
}

function buildRuntimeDefaults(): AppSettings {
  return {
    practice: { ...defaultSettings.practice },
    speech: {
      ...defaultSettings.speech,
      voice: getVoicesByLanguage(defaultSettings.speech.language)[0]?.name,
    },
    transfer: {
      importStrategy: defaultSettings.transfer.importStrategy,
      iceServers: cloneDeep(defaultSettings.transfer.iceServers),
    },
  }
}

function migrateSettings(stored: Partial<AppSettings> | undefined): AppSettings {
  const defaults = buildRuntimeDefaults()
  const next: AppSettings = {
    practice: { ...defaults.practice, ...(stored?.practice || {}) },
    speech: { ...defaults.speech, ...(stored?.speech || {}) },
    transfer: { ...defaults.transfer, ...(stored?.transfer || {}) },
  }
  // 二次兜底：voice 缺失时按语言回填
  if (!next.speech.voice) {
    next.speech.voice = getVoicesByLanguage(next.speech.language)[0]?.name
  }
  // iceServers 规范化
  if (!Array.isArray(next.transfer.iceServers) || next.transfer.iceServers.length === 0) {
    next.transfer.iceServers = defaults.transfer.iceServers
  }
  return next
}

export function useSettings() {
  const runtimeDefaults = buildRuntimeDefaults()
  const [settings, setSettings] = useLocalStorage<AppSettings>('tango-settings', runtimeDefaults)

  // 通用兼容：将存量本地配置与默认配置做一次迁移合并
  useEffect(() => {
    const migrated = migrateSettings(settings)
    // 简单比较，避免无意义写入
    if (JSON.stringify(migrated) !== JSON.stringify(settings)) {
      setSettings(migrated)
    }
  }, [settings, setSettings])

  const updatePracticeSettings = (practice: Partial<PracticeSettings>) => {
    setSettings((prev) => ({
      ...prev,
      practice: { ...prev.practice, ...practice },
    }))
  }

  const updateSpeechSettings = (speech: Partial<SpeechSettings>) => {
    if (speech.language) {
      speech.voice = getVoicesByLanguage(speech.language)[0]?.name
    }

    setSettings((prev) => ({
      ...prev,
      speech: { ...prev.speech, ...speech },
    }))
  }

  const resetSettings = () => {
    setSettings({
      practice: { ...defaultSettings.practice },
      speech: { ...defaultSettings.speech },
      transfer: defaultSettings.transfer as unknown as AppSettings['transfer'],
    })
  }

  return {
    settings,
    updatePracticeSettings,
    updateSpeechSettings,
    updateTransferSettings: (transfer: Partial<AppSettings['transfer']>) =>
      setSettings((prev) => ({ ...prev, transfer: { ...prev.transfer, ...transfer } })),
    resetSettings,
  }
}
