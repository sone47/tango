import { History, Menu } from 'lucide-react'

import Button from '@/components/Button'
import type { CardPack } from '@/types'

interface PracticeHeaderProps {
  selectedCardPack: CardPack | null
  hasData: boolean
  onSelectCardPack: () => void
  onShowHistoryPool: () => void
}

const PracticeHeader = ({
  selectedCardPack,
  hasData: _hasData,
  onSelectCardPack,
  onShowHistoryPool,
}: PracticeHeaderProps) => {
  if (!selectedCardPack) return null

  return (
    <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm">
      {/* 卡包选择按钮 */}
      <Button
        variant="secondary"
        size="sm"
        rounded="full"
        onClick={onSelectCardPack}
        icon={Menu}
        className="shadow-lg"
      >
        切换卡包
      </Button>

      {/* 历史卡池按钮 */}
      <Button
        variant="primary"
        size="sm"
        rounded="full"
        onClick={onShowHistoryPool}
        icon={History}
        className="shadow-md"
      >
        历史卡池
      </Button>
    </div>
  )
}

export default PracticeHeader
