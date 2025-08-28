import { PartyPopper } from 'lucide-react'
import { useRef } from 'react'

import Button from '@/components/Button'
import { Confetti, ConfettiRef } from '@/components/magicui/confetti'
import Typography from '@/components/Typography'
import { usePracticeStore } from '@/stores/practiceStore'

import FlashCard from './FlashCard'

const PracticeContent = () => {
  const confettiRef = useRef<ConfettiRef>(null)
  const { currentWordIndex, shuffledWords, selectedCardPack, resetPracticeState, updateState } =
    usePracticeStore()

  const handleContinueLearning = () => {
    resetPracticeState()
  }

  if (!selectedCardPack) {
    return null
  }

  if (currentWordIndex >= shuffledWords.length) {
    return (
      <div className="relative flex flex-col items-center justify-center gap-4 h-full pb-16">
        <PartyPopper className="size-16 text-primary" />
        <div className="flex flex-col items-center">
          <Typography.Title level={3} className="text-foreground">
            恭喜！
          </Typography.Title>
          <Typography.Title level={4} className="text-muted-foreground">
            你已经完成了本次学习~
          </Typography.Title>
          <Confetti ref={confettiRef} className="absolute left-0 top-0 z-0 size-full" />
        </div>

        <div className="relative flex flex-col gap-3 w-full px-8">
          <Button
            variant="primary"
            size="xl"
            className="rounded-lg"
            onClick={handleContinueLearning}
          >
            继续学习
          </Button>
          <Button
            variant="outline"
            size="xl"
            className="rounded-lg"
            onClick={() => updateState({ showHistoryPool: true })}
          >
            查看本次学习记录
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <FlashCard />
    </div>
  )
}

export default PracticeContent
