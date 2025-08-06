import { useLocalStorage } from '@uidotdev/usehooks'

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
}

export function useSettings() {
  const [settings, setSettings] = useLocalStorage<AppSettings>('tango-settings', {
    ...defaultSettings,
    speech: {
      ...defaultSettings.speech,
      voice: getVoicesByLanguage(defaultSettings.speech.language)[0]?.name,
    },
  })

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
    setSettings(defaultSettings)
  }

  return {
    settings,
    updatePracticeSettings,
    updateSpeechSettings,
    resetSettings,
  }
}
