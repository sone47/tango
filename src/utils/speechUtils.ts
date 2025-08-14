import { languageOptions } from '@/constants/settings'
import { SpeechSettings } from '@/types/settings'

export function getAvailableVoices(): SpeechSynthesisVoice[] {
  const voices = speechSynthesis.getVoices()
  return voices.filter((voice) => languageOptions.some((option) => voice.lang === option.value))
}

export function getVoicesByLanguage(language: string): SpeechSynthesisVoice[] {
  const voices = getAvailableVoices()
  const languagePrefix = language.split('-')[0]
  return voices.filter((voice) => voice.lang.startsWith(languagePrefix))
}

export function findVoiceByName(voiceName: string): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices()
  return voices.find((voice) => voice.name === voiceName)
}

export function textToSpeech(text: string, settings: SpeechSettings): void {
  stopSpeech()

  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = settings.language
  utterance.rate = settings.rate
  utterance.pitch = settings.pitch
  utterance.volume = settings.volume

  if (settings.voice) {
    const selectedVoice = findVoiceByName(settings.voice)
    if (selectedVoice) {
      utterance.voice = selectedVoice
    }
  }

  speechSynthesis.speak(utterance)
}

export function stopSpeech(): void {
  if (speechSynthesis.speaking) {
    speechSynthesis.cancel()
  }
}

export function isSpeechSynthesisSupported(): boolean {
  return 'speechSynthesis' in window
}

export function waitForVoicesReady(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    const voices = speechSynthesis.getVoices()
    if (voices.length > 0) {
      resolve(getAvailableVoices())
      return
    }

    const onVoicesChanged = () => {
      const availableVoices = getAvailableVoices()
      if (availableVoices.length > 0) {
        speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged)
        resolve(availableVoices)
      }
    }

    speechSynthesis.addEventListener('voiceschanged', onVoicesChanged)
  })
}
