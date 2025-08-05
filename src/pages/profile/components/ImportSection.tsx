import { FileText, Star, Upload } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/Button'
import Card from '@/components/Card'
import toast from '@/components/Toast'
import { colors } from '@/constants/styles'
import { useModalState } from '@/hooks/useModalState'
import { wordPackService } from '@/services/wordPackService'
import type { FormatField } from '@/types/excel'

import ExcelTemplateViewer from './ExcelTemplateViewer'
import UploadResultModal from './UploadResultModal'

const ImportSection = () => {
  const navigate = useNavigate()
  const [uploadResult, setUploadResult] = useState<{
    fileName: string
    isSuccess: boolean
    message?: string
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
    const hideLoading = toast.loading(`正在导入「${file.name}」...`)

    try {
      const importResult = await wordPackService.importFromExcel(file)

      if (importResult.success) {
        toast.success(`🎉 文件导入成功！`)
        setUploadResult({
          fileName: file.name,
          isSuccess: importResult.success,
          message: importResult.message,
          stats: importResult.stats,
          errors: importResult.errors,
        })
        uploadResultModal.open()
      } else {
        toast.error(`导入失败：${importResult.message || '未知错误'}`)
      }
    } catch (error) {
      console.error('文件处理失败:', error)
      toast.error('上传失败')
    } finally {
      hideLoading()
      setIsUploading(false)
      event.target.value = ''
    }
  }

  const handleRecommendedPacksClick = () => {
    navigate('/recommended-packs')
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
      <Button
        variant="ghost"
        size="sm"
        icon={Star}
        onClick={handleRecommendedPacksClick}
        className="text-gray-600 hover:text-gray-800"
      >
        推荐词包
      </Button>
    </div>
  )

  return (
    <>
      <Card title={cardTitle}>
        {/* 功能说明 */}
        <div className={`${colors.gradients.green} p-4 rounded-xl mb-4`}>
          <div className="flex items-start gap-3">
            <FileText size={20} className="text-green-600 mt-0.5 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h4 className="font-medium text-green-800 mb-2">Excel 文件导入</h4>

              {/* Excel模板查看器 */}
              <ExcelTemplateViewer formatFields={formatFields} />
            </div>
          </div>
        </div>

        {/* 上传按钮 */}
        <label
          htmlFor="file-upload"
          className={`flex items-center justify-center gap-3 w-full p-4 ${
            isUploading
              ? 'bg-gray-400 cursor-not-allowed'
              : `${colors.gradients.greenButton} cursor-pointer hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]`
          } text-white rounded-xl font-medium transition-all duration-200`}
        >
          <Upload size={20} className={isUploading ? 'animate-pulse' : ''} />
          <span>{isUploading ? '正在导入...' : '上传 Excel 文件'}</span>
        </label>
        <input
          id="file-upload"
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          disabled={isUploading}
          className="hidden"
        />
      </Card>

      {/* 上传结果弹窗 */}
      {uploadResult && (
        <UploadResultModal
          isOpen={uploadResultModal.isOpen}
          onClose={() => {
            uploadResultModal.close()
            setUploadResult(null)
          }}
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
