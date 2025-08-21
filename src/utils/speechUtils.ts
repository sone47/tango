import { VoiceList } from '@lobehub/tts'

export function getVoicesByLanguage(language: string) {
  const voiceList = new VoiceList(language)
  return voiceList.edgeVoiceOptions ?? []
}
