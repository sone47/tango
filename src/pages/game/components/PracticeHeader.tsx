import { ChevronLeft, History } from 'lucide-react'
import { useNavigate } from 'react-router'

import AlertDialog from '@/components/AlertDialog'
import Button from '@/components/Button'
import Typography from '@/components/Typography'
import { usePracticeStore } from '@/stores/practiceStore'

const PracticeHeader = () => {
  const navigate = useNavigate()
  const { selectedCardPack, currentWordIndex, shuffledWords, updateState } = usePracticeStore()
  if (currentWordIndex >= shuffledWords.length) return null

  const handleExitPractice = () => {
    navigate(-1)
  }

  return (
    <div className="flex items-center justify-between p-2 bg-background">
      <AlertDialog
        title="确定要退出本次学习吗？"
        description=" "
        confirmText="退出本次学习"
        cancelText="继续学习"
        onConfirm={handleExitPractice}
        trigger={<Button variant="ghost" size="md" icon={ChevronLeft} className="" />}
      ></AlertDialog>

      <Typography.Title level={6}>{selectedCardPack?.name}</Typography.Title>

      <Button
        variant="ghost"
        size="md"
        onClick={() => updateState({ showHistoryPool: true })}
        icon={History}
        className="text-primary"
      ></Button>
    </div>
  )
}

export default PracticeHeader
