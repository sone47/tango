import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

import Button from '@/components/Button'
import type { FormatField } from '@/types/excel'

interface ExcelTemplateViewerProps {
  formatFields: FormatField[]
}

const ExcelTemplateViewer = ({ formatFields }: ExcelTemplateViewerProps) => {
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
    const content = `${headers}\n${example}`

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
            <div className="flex bg-background border-b border-border">
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
            <div className="flex bg-background border-b border-border">
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
            <div className="flex bg-background">
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
