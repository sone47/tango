import OpenAI from 'openai'
import { useMemo, useRef, useState } from 'react'

import { useSettings } from './useSettings'

export function useExampleStream(word: string) {
  const { settings } = useSettings()

  const [content, setContent] = useState('')
  const [translation, setTranslation] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)

  const messages = useRef<{ role: 'system' | 'user' | 'assistant'; content: string }[]>([
    {
      role: 'system',
      content: `你是一个日语老师，请根据单词造句，生成一个例句（自然、符合语法），并给出翻译。每轮给出的例句与过去生成的场景和情境不一样，例句长度不要超过50个字符。
输出格式为两行：
例句: xxx
翻译: yyy`,
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

  const _generateExample = async () => {
    setIsGenerating(true)
    setContent('')
    setTranslation('')

    const response = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages: messages.current,
      temperature: 1.5,
      stream: true,
    })

    let buffer = ''

    try {
      for await (const chunk of response) {
        const delta = chunk.choices[0]?.delta?.content || ''
        if (delta) {
          buffer += delta

          const exMatch = buffer.match(/例句:\s*([^\n]+)/)
          const trMatch = buffer.match(/翻译:\s*([^\n]+)/)

          if (exMatch) {
            setContent(exMatch[1])
          }
          if (trMatch) {
            setTranslation(trMatch[1])
          }
        }
      }

      messages.current.push(
        {
          role: 'assistant',
          content: buffer,
        },
        { role: 'user', content: `单词：[${word}]` }
      )

      setTimeout(() => {
        setContent('')
        setTranslation('')
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return { content, translation, isGenerating, generateExample: _generateExample }
}
