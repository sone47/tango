import { isNil } from 'lodash'
import { CheckCircle, Upload, XCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/Button'
import Modal from '@/components/Modal'
import Typography from '@/components/Typography'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'

interface UploadResultModalProps {
  isOpen: boolean
  wordPackId?: number
  onClose: () => void
  isSuccess?: boolean
  message?: string
  stats?: {
    cardPackCount: number
    vocabularyCount: number
  }
  errors?: string[]
}

const UploadResultModal = ({
  isOpen,
  wordPackId,
  onClose,
  isSuccess,
  message,
  stats,
  errors,
}: UploadResultModalProps) => {
  const navigate = useNavigate()
  const { setCurrentWordPackId } = useCurrentWordPack()

  const handleStartClick = () => {
    if (!isNil(wordPackId)) {
      setCurrentWordPackId(wordPackId)
    }
    navigate('/')
  }

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
            className={`flex items-center justify-center gap-2 text-lg font-semibold ${isSuccess ? 'text-primary' : 'text-destructive'}`}
          >
            {isSuccess ? (
              <CheckCircle size={20} className="text-primary" />
            ) : (
              <XCircle size={20} className="text-destructive" />
            )}
            <h3>{isSuccess ? '导入成功' : '导入失败'}</h3>
          </div>

          <div className="text-sm space-y-2">
            {/* 显示消息 */}
            {message && <p className="text-muted-foreground">{message}</p>}

            {/* 显示成功统计信息 */}
            {isSuccess && stats && (
              <div className="bg-muted border rounded-lg p-3">
                <Typography.Title level={6} className="mb-2">
                  导入统计
                </Typography.Title>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-primary">{stats.cardPackCount}</div>
                    <div className="text-muted-foreground">卡包</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-primary">{stats.vocabularyCount}</div>
                    <div className="text-muted-foreground">词汇</div>
                  </div>
                </div>
              </div>
            )}

            {/* 显示错误信息 */}
            {!isSuccess && errors && errors.length > 0 && (
              <div className="bg-muted border rounded-lg p-3">
                <Typography.Title level={6} className="mb-2">
                  错误详情
                </Typography.Title>
                <div className="max-h-40 overflow-y-auto">
                  <ul className="flex flex-col items-start gap-1 text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    {errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {isSuccess && (
          <div className="pt-2">
            <Button variant="primary" onClick={handleStartClick} className="w-full">
              开始学习
            </Button>
          </div>
        )}
      </div>
    </Modal>
  )
}

export default UploadResultModal
