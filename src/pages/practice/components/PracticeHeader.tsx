import { History, Menu } from 'lucide-react'

import Button from '@/components/Button'
import { usePracticeStore } from '@/stores/practiceStore'

const PracticeHeader = () => {
  const { selectedCardPack, currentWordIndex, shuffledWords, updateState } = usePracticeStore()

  if (!selectedCardPack || currentWordIndex >= shuffledWords.length) return null

  return (
    <div className="flex items-center justify-between p-4 bg-white/70 backdrop-blur-sm">
      <Button
        variant="secondary"
        size="sm"
        onClick={() => updateState({ showCardPackSelector: true })}
        icon={Menu}
        className="shadow-lg"
      >
        切换卡包
      </Button>

      <Button
        variant="primary"
        size="sm"
        onClick={() => updateState({ showHistoryPool: true })}
        icon={History}
        className="shadow-md"
      >
        历史卡池
      </Button>
    </div>
  )
}

export default PracticeHeader
