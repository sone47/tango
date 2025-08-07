import { motion } from 'framer-motion'
import { LucideIcon, RotateCcw, Shuffle } from 'lucide-react'

import Button from '@/components/Button'
import { usePracticeStore } from '@/stores/practiceStore'
import type { CardPack, CardRevealState, Word } from '@/types'

import FlashCard from './FlashCard'

interface PracticeContentProps {
  selectedCardPack: CardPack | null
  shuffledWords: Word[]
  currentWordIndex: number
  onSelectCardPack: () => void
  onWordStudy: () => void
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
              rounded={action.rounded || 'full'}
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
  onWordStudy,
  onReset,
  onShuffle,
}: PracticeContentProps) => {
  const { revealState, updateState } = usePracticeStore()

  // 未选择卡包状态
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
          },
        ]}
      />
    )
  }

  // 完成状态
  if (currentWordIndex >= shuffledWords.length) {
    return (
      <EmptyState
        icon="🎉"
        title="恭喜完成！"
        description="你已经完成了所有卡片的练习"
        iconBgColor="bg-green-100"
        actions={[
          {
            label: '重新洗牌',
            onClick: onShuffle,
            icon: Shuffle,
            rounded: 'full',
            size: 'md',
          },
          {
            label: '重新开始',
            onClick: onReset,
            icon: RotateCcw,
            rounded: 'full',
            className: 'bg-green-500 hover:bg-green-600',
            size: 'md',
          },
          {
            label: '选择其他卡包',
            onClick: onSelectCardPack,
            variant: 'secondary',
            size: 'md',
          },
        ]}
      />
    )
  }

  // 正常学习状态
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
        onNextCard={onWordStudy}
        isFirstCard={currentWordIndex === 0}
        currentIndex={currentWordIndex}
        totalCount={shuffledWords.length}
      />
    </div>
  )
}

export default PracticeContent
