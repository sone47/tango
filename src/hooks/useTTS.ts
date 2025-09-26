import { SsmlOptions } from '@lobehub/tts/es/core/utils/genSSML'
import { useEdgeSpeech } from '@lobehub/tts/react'
import { toast } from 'sonner'

import { useSettings } from './useSettings'

export function useTTS(text: string) {
  const { settings } = useSettings()

  const res = useEdgeSpeech(text, {
    options: {
      voice: settings.speech.voice,
      rate: settings.speech.rate - 1,
    } as SsmlOptions,
    onError: (error) => {
      console.error(error)
      toast.error('语音生成失败')
    },
    dedupingInterval: 0,
  })

  return res
}
