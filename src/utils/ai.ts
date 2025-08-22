import OpenAI from 'openai'

export const generateExample = async (word: string, openai: OpenAI) => {
  const response = await openai.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      {
        role: 'system',
        content: `你是一个日语老师，请根据单词造句，生成一个例句（自然、符合语法），并给出翻译。
输出格式为两行：
例句: xxx
翻译: yyy`,
      },
      { role: 'user', content: `单词：[${word}]` },
    ],
    temperature: 1.5,
    stream: true,
  })

  return response
}
