import { LibraryBig, PartyPopper } from 'lucide-react'
import { motion } from 'motion/react'
import { useRef } from 'react'

import Button from '@/components/Button'
import { Confetti, ConfettiRef } from '@/components/magicui/confetti'
import Typography from '@/components/Typography'
import { usePracticeStore } from '@/stores/practiceStore'

import FlashCard from './FlashCard'

const PracticeContent = () => {
  const confettiRef = useRef<ConfettiRef>(null)

  const { currentWordIndex, selectedCardPack, shuffledWords, updateState } = usePracticeStore()

  const handleShowCardPackSelector = () => {
    updateState({ showCardPackSelector: true })
  }

  if (!selectedCardPack) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center gap-4"
        >
          <LibraryBig className="size-16 text-primary"></LibraryBig>
          <div className="flex flex-col items-center justify-center gap-1">
            <Typography.Title level={4}>未选择卡包</Typography.Title>
            <Typography.Text type="secondary">点击下方按钮选择一个卡包开始学习</Typography.Text>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full text-md"
            onClick={handleShowCardPackSelector}
          >
            开始学习
          </Button>
        </motion.div>
      </div>
    )
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
