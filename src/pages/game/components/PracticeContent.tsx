import { PartyPopper } from 'lucide-react'
import { useRef } from 'react'
import { useNavigate } from 'react-router'

import Button from '@/components/Button'
import { Confetti, ConfettiRef } from '@/components/magicui/confetti'
import Typography from '@/components/Typography'
import { usePracticeStore } from '@/stores/practiceStore'

import FlashCard from './FlashCard'

const PracticeContent = () => {
  const confettiRef = useRef<ConfettiRef>(null)
  const navigate = useNavigate()
  const { currentWordIndex, selectedCardPack, shuffledWords, updateState } = usePracticeStore()

  const handleShowCardPackSelector = () => {
    updateState({ showCardPackSelector: true })
  }

  if (!selectedCardPack) {
    navigate('/')
    return
  }

  if (currentWordIndex >= shuffledWords.length) {
    return (
      <div className="relative flex flex-col items-center justify-center gap-4 h-full">
        <PartyPopper className="w-10 h-10" />
        <div className="flex flex-col items-center">
          <Typography.Title level={5}>恭喜！</Typography.Title>
          <Typography.Title level={6} className="!text-gray-600">
            你已经完成了本次学习！
          </Typography.Title>
          <Confetti ref={confettiRef} className="absolute left-0 top-0 z-0 size-full" />
        </div>

        <div className="relative flex flex-col gap-4 w-full px-16 text-md">
          <Button variant="primary" size="lg" onClick={handleShowCardPackSelector}>
            继续学习
          </Button>
          <Button
            variant="outline"
            size="lg"
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
