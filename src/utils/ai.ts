import OpenAI from 'openai'

interface Example {
  example: string
  translation: string
}

export const generateExample = async (word: string, apiKey: string): Promise<Example | null> => {
  const openai = new OpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey,
    dangerouslyAllowBrowser: true,
  })

  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: `你是一个日语老师，请根据单词造句，生成一个例句，例句需要符合日语的语法和习惯，并且需要符合单词的意思，并给出例句的翻译。单词将以[]的形式包裹。
          使用JSON输出，格式为：{
            "example": "例句",
            "translation": "翻译"
          }`,
      },
      { role: 'user', content: `单词：[${word}]` },
    ],
    response_format: { type: 'json_object' },
    temperature: 1.5,
  })

  const content = response.choices[0].message.content
  if (!content) return null

  return JSON.parse(content)
}
