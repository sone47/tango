import { motion } from 'framer-motion'
import { LucideIcon, PartyPopper, RotateCcw, Shuffle } from 'lucide-react'
import { useRef, useState } from 'react'

import Button from '@/components/Button'
import { Confetti, ConfettiRef } from '@/components/magicui/confetti'
import Typography from '@/components/Typography'
import { useSettings } from '@/hooks/useSettings'
import { usePracticeStore } from '@/stores/practiceStore'
import type { CardPack, CardRevealState, Word } from '@/types'

import FlashCard from './FlashCard'

interface PracticeContentProps {
  selectedCardPack: CardPack | null
  shuffledWords: Word[]
  currentWordIndex: number
  onSelectCardPack: () => void
  onReset: () => void
  onShuffle: () => void
}

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  actions: Array<{
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary'
    size?: 'sm' | 'md' | 'lg'
    rounded?: 'sm' | 'md' | 'lg' | 'xl' | 'full'
    icon?: LucideIcon
    className?: string
  }>
  iconBgColor?: string
}

const EmptyState = ({
  icon,
  title,
  description,
  actions,
  iconBgColor = 'bg-gray-200',
}: EmptyStateProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center"
      >
        <div
          className={`w-32 h-32 ${iconBgColor} rounded-2xl mb-6 flex items-center justify-center`}
        >
          <span className="text-4xl">{icon}</span>
        </div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-600 mb-6 text-center">{description}</p>
        <div className="flex flex-col gap-3">
          {actions.map((action, index) => (
            <Button
              key={index}
              variant={action.variant || 'primary'}
              size={action.size || 'lg'}
              onClick={action.onClick}
              icon={action.icon}
              className={action.className}
            >
              {action.label}
            </Button>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

const PracticeContent = ({
  selectedCardPack,
  shuffledWords,
  currentWordIndex,
  onSelectCardPack,
  onReset,
  onShuffle,
}: PracticeContentProps) => {
  const { settings } = useSettings()

  const confettiRef = useRef<ConfettiRef>(null)

  const { revealState, updateState } = usePracticeStore()
  const [isShuffle, setIsShuffle] = useState(settings.practice.isShuffle)

  const handleRestart = () => {
    if (isShuffle) {
      onShuffle()
    } else {
      onReset()
    }
  }

  if (!selectedCardPack) {
    return (
      <EmptyState
        icon="📚"
        title="未选择卡包"
        description="点击下方按钮选择一个卡包开始学习"
        actions={[
          {
            label: '开始学习',
            onClick: onSelectCardPack,
            className: 'text-md',
          },
        ]}
      />
    )
  }

  if (currentWordIndex >= shuffledWords.length) {
    return (
      <div className="relative flex flex-col items-center justify-center gap-4 h-full">
        <PartyPopper className="w-10 h-10" />
        <div className="flex flex-col items-center">
          <Typography.Title level={5}>恭喜！</Typography.Title>
          <Typography.Title level={6} className="!text-gray-600">
            你已经完成了所有卡片的练习！
          </Typography.Title>
          <Confetti ref={confettiRef} className="absolute left-0 top-0 z-0 size-full" />
        </div>

        <div className="flex flex-col gap-3 w-full px-16">
          <div className="relative flex items-center gap-2">
            <Button
              className="flex-1"
              variant="primary"
              size="lg"
              icon={RotateCcw}
              onClick={handleRestart}
            >
              重新开始
            </Button>
            <Shuffle
              className="absolute -right-2 top-1/2 translate-x-full -translate-y-1/2 w-5 h-5 cursor-pointer"
              color={isShuffle ? 'var(--color-blue-600)' : 'var(--color-gray-400)'}
              onClick={() => setIsShuffle(!isShuffle)}
            />
          </div>
        </div>
      </div>
    )
  }

  const currentWord = shuffledWords[currentWordIndex]

  const handleRevealStateChange = (newRevealState: CardRevealState) => {
    updateState({ revealState: newRevealState })
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4">
      <FlashCard
        word={currentWord}
        revealState={revealState}
        onRevealStateChange={handleRevealStateChange}
        isFirstCard={currentWordIndex === 0}
        currentIndex={currentWordIndex}
        totalCount={shuffledWords.length}
      />
    </div>
  )
}

export default PracticeContent
