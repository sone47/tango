import { AlertTriangle } from 'lucide-react'

import Button from '@/components/Button'
import Modal from '@/components/Modal'
import type { CardPack } from '@/types'

interface SwitchConfirmModalProps {
  isOpen: boolean
  newCardPack: CardPack
  onConfirm: () => void
  onCancel: () => void
}

const SwitchConfirmModal = ({
  isOpen,
  newCardPack,
  onConfirm,
  onCancel,
}: SwitchConfirmModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="切换卡包确认"
      icon={AlertTriangle}
      iconColor="orange"
      maxWidth="sm"
    >
      <div className="mb-6">
        <p className="text-gray-700 mb-3">您正在练习中，切换到新卡包将：</p>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm text-orange-800">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            <span>丢失当前的练习进度</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-orange-800">
            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
            <span>重新开始新卡包的学习</span>
          </div>
        </div>
        <div className="mt-4 p-3 bg-gray-50 rounded-xl">
          <p className="text-sm text-gray-600">
            切换到：<span className="font-medium text-blue-600">{newCardPack.name}</span>
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <Button
          variant="danger"
          onClick={onConfirm}
          className="w-full bg-orange-500 hover:bg-orange-600"
        >
          确认切换
        </Button>

        <Button variant="secondary" onClick={onCancel} className="w-full">
          取消，继续当前练习
        </Button>
      </div>
    </Modal>
  )
}

export default SwitchConfirmModal
