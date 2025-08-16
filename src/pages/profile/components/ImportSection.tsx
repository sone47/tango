import { isNil } from 'lodash'
import { FileText, LibraryBig, Upload } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Card from '@/components/Card'
import { colors } from '@/constants/styles'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { useModalState } from '@/hooks/useModalState'
import { ImportResult, wordPackService } from '@/services/wordPackService'
import { useWordPackStore } from '@/stores/wordPackStore'
import type { FormatField } from '@/types/excel'

import ExcelTemplateViewer from './ExcelTemplateViewer'
import UploadResultModal from './UploadResultModal'

const ImportSection = () => {
  const navigate = useNavigate()
  const { setCurrentWordPackId, currentWordPack } = useCurrentWordPack()
  const wordPackStore = useWordPackStore()
  const [uploadResult, setUploadResult] = useState<{
    fileName: string
    isSuccess: boolean
    message?: string
    wordPackId?: number
    stats?: {
      cardPackCount: number
      vocabularyCount: number
    }
    errors?: string[]
  } | null>(null)

  const [isUploading, setIsUploading] = useState(false)

  const uploadResultModal = useModalState()

  const formatFields: FormatField[] = [
    { label: '音标', example: 'べんきょう' },
    { label: '写法', example: '勉強' },
    { label: '释义', example: '学习' },
    { label: '例句', example: '勉強すればするほど、難しくなる感じがします。' },
    { label: '卡包名', example: '第一課　出会い' },
    { label: '词汇音频', example: '' },
    { label: '例句音频', example: '' },
  ]

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsUploading(true)

    try {
      const importResult = await wordPackService.importFromExcel(file)

      if (importResult.success) {
        handleImportSuccess(file.name, importResult)
      } else {
        toast.error(`导入失败：${importResult.message || '未知错误'}`)
      }
    } catch (error) {
      console.error('文件处理失败:', error)
      toast.error('上传失败')
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const handleImportSuccess = (fileName: string, importResult: ImportResult) => {
    if (!currentWordPack) {
      setCurrentWordPackId(importResult.wordPackId!)
    }

    setUploadResult({
      fileName,
      isSuccess: importResult.success,
      message: importResult.message,
      wordPackId: importResult.wordPackId,
      stats: importResult.stats,
      errors: importResult.errors,
    })

    uploadResultModal.open()

    wordPackStore.fetchWordPacks()
  }

  const handleRecommendedPacksClick = () => {
    navigate('/recommended-packs')
  }

  const handleUploadResultClose = () => {
    uploadResultModal.close()
    setUploadResult(null)
  }

  const handleStartClick = () => {
    if (!isNil(uploadResult?.wordPackId)) {
      setCurrentWordPackId(uploadResult.wordPackId)
    }
    navigate('/')
  }

  const cardTitle = (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center`}
        >
          <Upload size={20} />
        </div>
        <h2 className="text-lg font-semibold text-gray-900">导入词包</h2>
      </div>
      <Button variant="ghost" size="sm" icon={LibraryBig} onClick={handleRecommendedPacksClick}>
        词包库
      </Button>
    </div>
  )

  return (
    <>
      <Card title={cardTitle}>
        <div className={`${colors.gradients.green} p-4 rounded-xl mb-4`}>
          <div className="flex items-start gap-3">
            <FileText size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-green-800 mb-2">Excel 文件导入</h4>

              <ExcelTemplateViewer formatFields={formatFields} />
            </div>
          </div>
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
      </Card>

      {uploadResult && (
        <UploadResultModal
          isOpen={uploadResultModal.isOpen}
          onClose={handleUploadResultClose}
          onStart={handleStartClick}
          fileName={uploadResult.fileName}
          isSuccess={uploadResult.isSuccess}
          message={uploadResult.message}
          stats={uploadResult.stats}
          errors={uploadResult.errors}
        />
      )}
    </>
  )
}

export default ImportSection
