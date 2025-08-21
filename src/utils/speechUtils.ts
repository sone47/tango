import { VoiceList } from '@lobehub/tts'

export function getVoicesByLanguage(language: string) {
  const voiceList = new VoiceList(language)
  return voiceList.edgeVoiceOptions ?? []
}

export function findVoiceByName(voiceName: string): SpeechSynthesisVoice | undefined {
  const voices = speechSynthesis.getVoices()
  return voices.find((voice) => voice.name === voiceName)
}
