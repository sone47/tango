import { useLocalStorage } from '@uidotdev/usehooks'

import { defaultSettings } from '@/constants/settings'
import { getVoicesByLanguage } from '@/utils/speechUtils'

export interface WordOrderSettings {
  mode: 'sequential' | 'random'
}

export interface SpeechSettings {
  language: string
  rate: number // 0.1 - 10
  pitch: number // 0 - 2
  volume: number // 0 - 1
  voice?: string
}

export interface AppSettings {
  wordOrder: WordOrderSettings
  speech: SpeechSettings
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('tango-settings', {
    ...defaultSettings,
    speech: {
      ...defaultSettings.speech,
      voice: getVoicesByLanguage(defaultSettings.speech.language)[0]?.name,
    },
  })

  const updateWordOrderSettings = (wordOrder: Partial<WordOrderSettings>) => {
    setSettings((prev) => ({
      ...prev,
      wordOrder: { ...prev.wordOrder, ...wordOrder },
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
    setSettings(defaultSettings)
  }

  return {
    settings,
    updateWordOrderSettings,
    updateSpeechSettings,
    resetSettings,
  }
}
