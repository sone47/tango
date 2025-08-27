import { Upload } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { ImportResult, wordPackService } from '@/services/wordPackService'

import ExcelTemplateViewer from './ExcelTemplateViewer'

interface ImportSectionProps {
  onFinish: (importResult: ImportResult) => void
}

const ImportSection = ({ onFinish }: ImportSectionProps) => {
  const { setCurrentWordPackId, currentWordPack } = useCurrentWordPack()

  const [isUploading, setIsUploading] = useState(false)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const importResult = await wordPackService.importFromExcel(file)

      handleImportFinish(importResult)
    } catch (error) {
      console.error('文件处理失败:', error)
      toast.error('上传失败')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const handleImportFinish = (importResult: ImportResult) => {
    if (importResult.success && !currentWordPack) {
      setCurrentWordPackId(importResult.wordPackId!)
    }

    onFinish(importResult)
  }

  return (
    <>
      <div className="bg-muted p-4 rounded-xl mb-4">
        <ExcelTemplateViewer />
      </div>

      <label className="w-full cursor-pointer">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
        />
        <Button
          variant="primary"
          icon={Upload}
          className="w-full pointer-events-none"
          loading={isUploading}
        >
          {isUploading ? '正在导入...' : '上传 Excel 文件'}
        </Button>
      </label>
    </>
  )
}

export default ImportSection
