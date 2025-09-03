import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import Button from '@/components/Button'
import { LanguageEnum, PartOfSpeechEnum, partOfSpeechToLanguageMap } from '@/constants/language'

interface FormatField {
  label: string
  example: string
  description?: string
}

const formatFields: FormatField[] = [
  { label: '音标', example: 'べんきょう' },
  { label: '写法', example: '勉強' },
  { label: '释义', example: '学习' },
  {
    label: '词性',
    example: '名词',
    description: `请填入：${Object.values(
      partOfSpeechToLanguageMap[LanguageEnum.japanese] as Record<PartOfSpeechEnum, string>
    ).join('、')}，或置空`,
  },
  { label: '例句', example: '勉強すればするほど、難しくなる感じがします。' },
  { label: '例句翻译', example: '学得越多，越觉得难。' },
  { label: '卡包名', example: '第一課　出会い' },
  { label: '单词音频', example: '' },
  { label: '例句音频', example: '' },
]

const ExcelTemplateViewer = () => {
  const [copySuccess, setCopySuccess] = useState(false)

  // 根据表头长度自动生成Excel列标识
  const generateExcelColumns = (count: number) => {
    const columns = []
    for (let i = 0; i < count; i++) {
      // 生成Excel列标识：A, B, C, ..., Z, AA, AB, ...
      let columnName = ''
      let num = i
      do {
        columnName = String.fromCharCode(65 + (num % 26)) + columnName
        num = Math.floor(num / 26) - 1
      } while (num >= 0)
      columns.push(columnName)
    }
    return columns
  }

  const excelColumns = generateExcelColumns(formatFields.length)

  const handleCopyHeaders = async () => {
    const headers = formatFields.map((field) => field.label).join('\t')
    const example = formatFields.map((field) => field.example).join('\t')
    const description = formatFields.map((field) => field.description).join('\t')
    const content = `${headers}\n${example}\n${description}`

    try {
      await navigator.clipboard.writeText(content)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-max">
            {/* Excel列标识行 */}
            <div className="flex bg-card border-b border-border">
              {excelColumns.map((col) => (
                <div
                  key={col}
                  className="w-32 px-3 py-2 text-xs font-medium text-foreground text-center border-r border-border last:border-r-0 flex-shrink-0"
                >
                  {col}
                </div>
              ))}
            </div>

            {/* 表头内容行 */}
            <div className="flex bg-card border-b border-border">
              {formatFields.map((field) => (
                <div
                  key={field.label}
                  className="w-32 px-3 py-3 text-sm font-medium text-foreground text-center border-r border-border last:border-r-0 flex-shrink-0"
                >
                  {field.label}
                </div>
              ))}
            </div>

            {/* 示例数据行 */}
            <div className="flex bg-card border-b">
              {formatFields.map((field, index) => (
                <div
                  key={index}
                  className="w-32 px-3 py-3 text-sm text-foreground text-center border-r border-border last:border-r-0 flex-shrink-0"
                >
                  {field.example || '(空)'}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={handleCopyHeaders}
        icon={copySuccess ? Check : Copy}
        className="w-full"
      >
        {copySuccess ? '已复制模板' : '复制模板到剪贴板'}
      </Button>
    </div>
  )
}

export default ExcelTemplateViewer
