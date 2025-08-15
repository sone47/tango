import { AnimatePresence, motion } from 'framer-motion'
import { Check, Copy, Eye, EyeOff, Table } from 'lucide-react'
import { useState } from 'react'

import Button from '@/components/Button'
import type { FormatField } from '@/types/excel'

interface ExcelTemplateViewerProps {
  formatFields: FormatField[]
  className?: string
}

const ExcelTemplateViewer = ({ formatFields, className = '' }: ExcelTemplateViewerProps) => {
  const [copySuccess, setCopySuccess] = useState(false)
  const [showTemplate, setShowTemplate] = useState(false)

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

  const toggleTemplate = () => {
    setShowTemplate(!showTemplate)
  }

  return (
    <div className={`bg-white/60 rounded-lg p-3 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Table size={16} className="text-green-600" />
          <span className="text-sm font-medium text-green-800">导入模板</span>
        </div>

        {/* 查看/隐藏模板按钮 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTemplate}
          icon={showTemplate ? EyeOff : Eye}
        >
          {showTemplate ? '隐藏模板' : '查看模板'}
        </Button>
      </div>

      {/* 模板内容 */}
      <AnimatePresence>
        {showTemplate && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{
              opacity: 1,
              height: 'auto',
              marginTop: 12,
              transition: {
                duration: 0.3,
                ease: 'easeOut',
                height: { duration: 0.4 },
                opacity: { duration: 0.25, delay: 0.1 },
              },
            }}
            exit={{
              opacity: 0,
              height: 0,
              marginTop: 0,
              transition: {
                duration: 0.25,
                ease: 'easeIn',
                opacity: { duration: 0.15 },
                height: { duration: 0.3, delay: 0.1 },
              },
            }}
            style={{ overflow: 'hidden' }}
          >
            <div className="bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mb-3">
              <div className="overflow-x-auto">
                <div className="min-w-max">
                  {/* Excel列标识行 */}
                  <div className="flex bg-gray-100 border-b border-gray-200">
                    {excelColumns.map((col) => (
                      <div
                        key={col}
                        className="w-32 px-3 py-2 text-xs font-medium text-gray-500 text-center border-r border-gray-200 last:border-r-0 flex-shrink-0"
                      >
                        {col}
                      </div>
                    ))}
                  </div>

                  {/* 表头内容行 */}
                  <div className="flex bg-white border-b border-gray-200">
                    {formatFields.map((field) => (
                      <div
                        key={field.label}
                        className="w-32 px-3 py-3 text-sm font-medium text-gray-700 text-center border-r border-gray-200 last:border-r-0 flex-shrink-0"
                      >
                        {field.label}
                      </div>
                    ))}
                  </div>

                  {/* 示例数据行 */}
                  <div className="flex bg-blue-50">
                    {formatFields.map((field, index) => (
                      <div
                        key={index}
                        className="w-32 px-3 py-3 text-sm text-gray-600 text-center border-r border-gray-200 last:border-r-0 flex-shrink-0"
                      >
                        {field.example || '(空)'}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

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
