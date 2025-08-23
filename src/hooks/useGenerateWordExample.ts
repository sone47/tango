import OpenAI from 'openai'
import { useMemo, useState } from 'react'

import { generateExample } from '@/utils/ai'

import { useSettings } from './useSettings'

export function useExampleStream() {
  const { settings } = useSettings()

  const [example, setExample] = useState('')
  const [translation, setTranslation] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const client = useMemo(
    () =>
      new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: settings.advanced.aiApiKey.trim(),
        dangerouslyAllowBrowser: true,
      }),
    [settings.advanced.aiApiKey]
  )

  const _generateExample = async (word: string) => {
    setIsGenerating(true)
    setExample('')
    setTranslation('')

    const response = await generateExample(word, client)

    let buffer = ''

    try {
      for await (const chunk of response) {
        const delta = chunk.choices[0]?.delta?.content || ''
        if (delta) {
          buffer += delta

          const exMatch = buffer.match(/例句:\s*([^\n]+)/)
          const trMatch = buffer.match(/翻译:\s*([^\n]+)/)

          if (exMatch) {
            setExample(exMatch[1])
          }
          if (trMatch) {
            setTranslation(trMatch[1])
          }
        }
      }

      requestAnimationFrame(() => {
        setExample('')
        setTranslation('')
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return { example, translation, isGenerating, generateExample: _generateExample }
}
