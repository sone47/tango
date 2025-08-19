import { CheckCircle, Upload, XCircle } from 'lucide-react'

import Button from '@/components/Button'
import Modal from '@/components/Modal'

interface UploadResultModalProps {
  isOpen: boolean
  onClose: () => void
  onStart: () => void
  fileName: string
  isSuccess: boolean
  message?: string
  stats?: {
    cardPackCount: number
    vocabularyCount: number
  }
  errors?: string[]
}

const UploadResultModal = ({
  isOpen,
  onClose,
  onStart,
  fileName,
  isSuccess,
  message,
  stats,
  errors,
}: UploadResultModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="上传结果"
      icon={Upload}
      iconColor="blue"
      maxWidth="sm"
    >
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <div
            className={`flex items-center justify-center gap-2 text-lg font-semibold ${isSuccess ? 'text-green-800' : 'text-red-800'}`}
          >
            {isSuccess ? (
              <CheckCircle size={20} className="text-green-600" />
            ) : (
              <XCircle size={20} className="text-red-600" />
            )}
            <h3>{isSuccess ? '导入成功' : '导入失败'}</h3>
          </div>

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              文件名: <span className="font-medium">{fileName}</span>
            </p>

            {/* 显示消息 */}
            {message && <p className={isSuccess ? 'text-green-700' : 'text-red-700'}>{message}</p>}

            {/* 显示成功统计信息 */}
            {isSuccess && stats && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <h4 className="font-medium text-green-800 mb-2">导入统计</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-green-600">{stats.cardPackCount}</div>
                    <div className="text-gray-600">卡包</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">{stats.vocabularyCount}</div>
                    <div className="text-gray-600">词汇</div>
                  </div>
                </div>
              </div>
            )}

            {/* 显示错误信息 */}
            {!isSuccess && errors && errors.length > 0 && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <h4 className="font-medium text-red-800 mb-2">错误详情</h4>
                <div className="max-h-40 overflow-y-auto">
                  <ul className="flex flex-col items-start gap-1 text-xs text-red-700 space-y-1 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <Button variant="primary" onClick={onStart} className="w-full">
            开始学习
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default UploadResultModal
