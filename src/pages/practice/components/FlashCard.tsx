import { Volume2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

import Button from '@/components/Button'
import ProficiencySlider from '@/components/ProficiencySlider'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils'
import { practiceService } from '@/services/practiceService'
import { usePracticeStore } from '@/stores/practiceStore'
import type { CardRevealState, Word } from '@/types'
import { textToSpeech } from '@/utils/speechUtils'

import FlashCardExampleSide from './FlashCardExampleSide'
import FlashCardHeader from './FlashCardHeader'
import RevealOverlay from './RevealOverlay'
import VerticalSwipeHandler from './VerticalSwipeHandler'

interface FlashCardProps {
  word: Word
  revealState: CardRevealState
  onRevealStateChange: (state: CardRevealState) => void
  currentIndex?: number
  totalCount?: number
}

enum SwipePrompt {
  None = 0,
  Correct = 1,
  Incorrect = 2,
}

const cardItemNames = ['phonetic', 'word', 'definition'] as const

const FlashCard = ({
  word,
  revealState,
  onRevealStateChange,
  currentIndex,
  totalCount,
}: FlashCardProps) => {
  const { settings } = useSettings()
  const { updateState, studiedWords, currentWordIndex, shuffledWords } = usePracticeStore()

  const [isFlipped, setIsFlipped] = useState(false)
  const [proficiency, setProficiency] = useState(0)
  const [isManualUpdateProficiency, setIsManualUpdateProficiency] = useState(false)
  const [swipePrompt, setSwipePrompt] = useState<SwipePrompt>(SwipePrompt.None)

  const isDraggingRef = useRef<Record<keyof CardRevealState, boolean>>({
    phonetic: false,
    word: false,
    definition: false,
  })

  const playButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    practiceService.getPracticeByVocabularyId(word.id).then((practice) => {
      setProficiency(practice?.proficiency ?? 0)
    })

    resetRevealState()

    if (settings.practice.isAutoPlayAudio) {
      playButtonRef.current?.click()
    }
  }, [word.id])

  const isFirstCard = currentIndex === 0
  const isAllRevealed = cardItemNames.every((name) => revealState[name])
  const guideItemName = cardItemNames.find((name) => settings.practice.hiddenInCard.includes(name))

  const goToNextCard = async () => {
    updateState({
      studiedWords: [...studiedWords, shuffledWords[currentWordIndex]],
      currentWordIndex: currentWordIndex + 1,
    })

    resetRevealState()
    setIsFlipped(false)
    setIsManualUpdateProficiency(false)
  }

  const resetRevealState = () => {
    updateState({
      revealState: Object.fromEntries(
        cardItemNames.map((name) => [name, !settings.practice.hiddenInCard.includes(name)])
      ) as Record<(typeof cardItemNames)[number], boolean>,
    })
  }

  const handleCardFlip = (e: React.MouseEvent) => {
    if (!e.currentTarget.contains(e.target as Node) || !isAllRevealed) {
      return
    }

    setIsFlipped(!isFlipped)
  }

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (!e.currentTarget.contains(e.target as Node) || !isAllRevealed) {
      return
    }

    onRevealStateChange({
      phonetic: true,
      word: true,
      definition: true,
    })
  }

  const handleSwipeUpProcess = () => {
    if (swipePrompt === SwipePrompt.Correct) return
    setSwipePrompt(SwipePrompt.Correct)
  }

  const handleSwipeDownProcess = () => {
    if (swipePrompt === SwipePrompt.Incorrect) return
    setSwipePrompt(SwipePrompt.Incorrect)
  }

  const handleSwipeReset = () => {
    if (swipePrompt === SwipePrompt.None) return

    setSwipePrompt(SwipePrompt.None)
  }

  const handleSwipeUp = () => {
    const newProficiency = Math.min(100, proficiency + (isManualUpdateProficiency ? 0 : 14))

    autoUpdateProficiency(newProficiency)
    setSwipePrompt(SwipePrompt.None)

    setTimeout(() => {
      goToNextCard()
    }, 500)
  }

  const handleSwipeDown = () => {
    const newProficiency = Math.max(0, proficiency - (isManualUpdateProficiency ? 0 : 14))

    autoUpdateProficiency(newProficiency)
    setSwipePrompt(SwipePrompt.None)

    setTimeout(() => {
      goToNextCard()
    }, 500)
  }

  const autoUpdateProficiency = (newProficiency: number) => {
    if (isManualUpdateProficiency) return

    practiceService.updatePractice(word.id, { proficiency: newProficiency })
  }

  const handleRevealDragStart = (field: keyof CardRevealState) => {
    isDraggingRef.current[field] = true
  }

  const handleRevealDragEnd = (field: keyof CardRevealState, offsetX: number) => {
    isDraggingRef.current[field] = false

    // 只在拖拽结束时且达到阈值时才触发reveal
    if (Math.abs(offsetX) >= 80 && !revealState[field]) {
      onRevealStateChange({
        ...revealState,
        [field]: true,
      })
    }
  }

  const handleProficiencyChange = (value: number) => {
    if (!isAllRevealed) return
    setProficiency(value)
  }

  const handleProficiencyChangeComplete = (value: number) => {
    if (!isAllRevealed) return

    setIsManualUpdateProficiency(true)
    practiceService.updatePractice(word.id, { proficiency: value })
  }

  const handlePlayAudio = (text?: string, audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play()
    } else {
      if (!text) return

      textToSpeech(text, settings.speech)
    }
  }

  const handlePlayPhoneticAudio = (event: React.MouseEvent) => {
    event.stopPropagation()

    handlePlayAudio(word.word || word.phonetic, word.wordAudio)
  }

  return (
    <motion.div
      className="w-full max-w-sm h-full flex flex-col gap-4"
      key={word.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* 卡片容器 */}
      <div
        className="z-1 flex-1 perspective-1000 min-h-0"
        onClick={handleCardFlip}
        onDoubleClick={handleDoubleClick}
      >
        <VerticalSwipeHandler
          enabled={isAllRevealed}
          onSwipeUp={handleSwipeUp}
          onSwipeDown={handleSwipeDown}
          onSwipeUpProcess={handleSwipeUpProcess}
          onSwipeDownProcess={handleSwipeDownProcess}
          onSwipeReset={handleSwipeReset}
        >
          <motion.div
            className={cn(
              'relative flex flex-col h-full transform-style-preserve-3d transition-all duration-200 rounded-3xl shadow-2xl p-4',
              isFlipped ? 'rotate-y-180' : '',
              isFlipped ? 'bg-gradient-to-br from-blue-50 to-indigo-100' : 'bg-white',
              swipePrompt === SwipePrompt.Correct
                ? 'border-2 border-green-300 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                : '',
              swipePrompt === SwipePrompt.Incorrect
                ? 'border-2 border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                : ''
            )}
          >
            {currentIndex !== undefined && totalCount !== undefined && (
              <FlashCardHeader
                currentIndex={currentIndex}
                totalCount={totalCount}
                variant={isFlipped ? 'dark' : 'light'}
                className={isFlipped ? 'rotate-y-180' : ''}
              />
            )}

            <div className="absolute top-0 left-0 w-full h-full p-4 backface-hidden flex flex-col">
              {/* 内容区域 */}
              <div className="flex-1 flex flex-col justify-center space-y-8 min-h-0">
                <RevealOverlay
                  isRevealed={revealState.phonetic}
                  label="音标"
                  colorScheme="blue"
                  onDragStart={() => handleRevealDragStart('phonetic')}
                  onDragEnd={(offsetX) => handleRevealDragEnd('phonetic', offsetX)}
                  showGuide={isFirstCard && guideItemName === 'phonetic'}
                >
                  <div className="flex items-center justify-center gap-2 h-12">
                    <span className="text-xl font-medium text-gray-800">{word.phonetic}</span>
                    {(word.phonetic || word.word) && (
                      <Button
                        ref={playButtonRef}
                        onClick={handlePlayPhoneticAudio}
                        variant="ghost"
                        size="sm"
                        icon={Volume2}
                      ></Button>
                    )}
                  </div>
                </RevealOverlay>

                <RevealOverlay
                  isRevealed={revealState.word}
                  label="写法"
                  colorScheme="purple"
                  onDragStart={() => handleRevealDragStart('word')}
                  onDragEnd={(offsetX) => handleRevealDragEnd('word', offsetX)}
                  showGuide={isFirstCard && guideItemName === 'word'}
                >
                  <div className="flex items-center justify-center h-16">
                    <span className="text-3xl font-bold text-gray-900">{word.word}</span>
                  </div>
                </RevealOverlay>

                <RevealOverlay
                  isRevealed={revealState.definition}
                  label="释义"
                  colorScheme="emerald"
                  onDragStart={() => handleRevealDragStart('definition')}
                  onDragEnd={(offsetX) => handleRevealDragEnd('definition', offsetX)}
                  showGuide={isFirstCard && guideItemName === 'definition'}
                >
                  <div className="flex items-center justify-center h-12">
                    <span className="text-lg text-gray-700">{word.definition}</span>
                  </div>
                </RevealOverlay>
              </div>

              {/* 底部提示 */}
              <div className="text-center text-xs text-gray-500 mb-2 flex-shrink-0 space-y-1">
                {isAllRevealed ? (
                  <>
                    <div>点击卡片查看例句</div>
                    <div>上滑「已掌握」· 下滑「未掌握」</div>
                  </>
                ) : (
                  <div>双击卡片快速显示所有内容</div>
                )}
              </div>
            </div>

            <FlashCardExampleSide word={word} className="absolute top-0 left-0 w-full h-full p-4" />
          </motion.div>
        </VerticalSwipeHandler>
      </div>

      <ProficiencySlider
        value={proficiency}
        onChange={handleProficiencyChange}
        onChangeComplete={handleProficiencyChangeComplete}
        disabled={!isAllRevealed}
        size="lg"
        className="bg-white/80 p-4"
      />
    </motion.div>
  )
}

export default FlashCard
