import OpenAI from 'openai'
import { useMemo, useRef, useState } from 'react'

import { useSettings } from './useSettings'

interface GeneratedEventProps {
  content: string
  translation: string
}

interface EventsProps {
  onGenerating?: (data: GeneratedEventProps) => void
  onGenerated?: (data: GeneratedEventProps) => void
}

export function useExampleStream(word: string, events?: EventsProps) {
  const { settings } = useSettings()

  const [isGenerating, setIsGenerating] = useState(false)

  const messages = useRef<{ role: 'system' | 'user' | 'assistant'; content: string }[]>([
    {
      role: 'system',
      content: `你是一个日语老师，请根据单词造句，生成一个例句（自然、符合语法），并给出翻译。每轮给出的例句与过去生成的场景和情境不一样，例句长度不要超过50个字符。
输出格式为两行，用换行符分隔。第一行为例句，第二行为中文翻译。`,
    },
    { role: 'user', content: `单词：[${word}]` },
  ])

  const client = useMemo(
    () =>
      new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: settings.advanced.aiApiKey.trim(),
        dangerouslyAllowBrowser: true,
      }),
    [settings.advanced.aiApiKey]
  )

  const generateExample = async () => {
    setIsGenerating(true)

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages.current,
      temperature: 1.5,
      stream: true,
    })

    let buffer = ''
    let content = ''
    let translation = ''

    try {
      for await (const chunk of response) {
        const delta = chunk.choices[0]?.delta?.content || ''
        if (delta) {
          buffer += delta

          const [ex, tr] = buffer.split('\n')
          content = ex
          translation = tr

          events?.onGenerating?.({ content, translation })
        }
      }

      messages.current.push(
        {
          role: 'assistant',
          content: buffer,
        },
        { role: 'user', content: `单词：[${word}]` }
      )

      events?.onGenerated?.({ content, translation })
    } finally {
      setIsGenerating(false)
    }
  }

  return { isGenerating, generateExample }
}
