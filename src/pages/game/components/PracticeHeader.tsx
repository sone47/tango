import { History, LogOut, Menu } from 'lucide-react'
import { useNavigate } from 'react-router'

import AlertDialog from '@/components/AlertDialog'
import Button from '@/components/Button'
import { usePracticeStore } from '@/stores/practiceStore'

const PracticeHeader = () => {
  const navigate = useNavigate()
  const { selectedCardPack, currentWordIndex, shuffledWords, updateState } = usePracticeStore()
  if (!selectedCardPack || currentWordIndex >= shuffledWords.length) return null

  const handleExitPractice = () => {
    navigate(-1)
  }

  return (
    <div className="flex items-center justify-between p-4 bg-background backdrop-blur-sm">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateState({ showCardPackSelector: true })}
          icon={Menu}
          className="shadow-lg"
        >
          切换卡包
        </Button>

        <AlertDialog
          title="确定要退出本次学习吗？"
          description=" "
          confirmText="退出本次学习"
          cancelText="继续学习"
          onConfirm={handleExitPractice}
          trigger={
            <Button variant="outline" size="sm" icon={LogOut} className="shadow-lg">
              退出
            </Button>
          }
        ></AlertDialog>
      </div>

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
