import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

import ProficiencySlider from '@/components/ProficiencySlider'
import { FlashCardItemNameMap } from '@/constants/flashCard'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils'
import { practiceService } from '@/services/practiceService'
import { usePracticeStore } from '@/stores/practiceStore'

import FlashCardBack from './FlashCardBack'
import FlashCardFront from './FlashCardFront'
import FlashCardHeader from './FlashCardHeader'
import VerticalSwipeHandler from './VerticalSwipeHandler'

enum SwipePrompt {
  None = 0,
  Correct = 1,
  Incorrect = 2,
}

const cardItemNames = Object.keys(FlashCardItemNameMap) as (keyof typeof FlashCardItemNameMap)[]
const cardExitDuration = 300
const cardExitDelay = cardExitDuration + 100

const FlashCard = () => {
  const { settings } = useSettings()
  const { currentWordIndex, shuffledWords, updateState, studiedWords, revealState } =
    usePracticeStore()

  const [isFlipped, setIsFlipped] = useState(false)
  const [proficiency, setProficiency] = useState(0)
  const [isManualUpdateProficiency, setIsManualUpdateProficiency] = useState(false)
  const [swipePrompt, setSwipePrompt] = useState<SwipePrompt>(SwipePrompt.None)
  const [isExampleScrolling, setIsExampleScrolling] = useState(false)

  const isAllRevealed = cardItemNames.every((name) => revealState[name])
  const totalCount = shuffledWords.length
  const word = shuffledWords[currentWordIndex]

  useEffect(() => {
    practiceService.getPracticeByVocabularyId(word.id).then((practice) => {
      setProficiency(practice?.proficiency ?? 0)
    })

    resetRevealState()
  }, [word.id])

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
        cardItemNames.map((name) => [
          name,
          !settings.practice.hiddenInCard.includes(name) || !word[name],
        ])
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
    if (!e.currentTarget.contains(e.target as Node)) {
      return
    }

    updateState({
      revealState: Object.fromEntries(
        Object.keys(FlashCardItemNameMap).map((name) => [name, true])
      ) as Record<keyof typeof FlashCardItemNameMap, boolean>,
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
    }, cardExitDelay)
  }

  const handleSwipeDown = () => {
    const newProficiency = Math.max(0, proficiency - (isManualUpdateProficiency ? 0 : 14))

    autoUpdateProficiency(newProficiency)
    setSwipePrompt(SwipePrompt.None)

    setTimeout(() => {
      goToNextCard()
    }, cardExitDelay)
  }

  const autoUpdateProficiency = (newProficiency: number) => {
    if (isManualUpdateProficiency) return

    practiceService.updatePractice(word.id, { proficiency: newProficiency })
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

  const handleExampleScroll = (isScrolling: boolean) => {
    setIsExampleScrolling(isScrolling)
  }

  return (
    <motion.div
      className="w-full max-w-sm h-full flex flex-col gap-4"
      key={word.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      <div
        className="z-1 flex-1 perspective-1000 min-h-0"
        onClick={handleCardFlip}
        onDoubleClick={handleDoubleClick}
      >
        <VerticalSwipeHandler
          enabled={isAllRevealed && !isExampleScrolling}
          exitDuration={cardExitDuration}
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
            {currentWordIndex !== undefined && totalCount !== undefined && (
              <FlashCardHeader
                currentIndex={currentWordIndex}
                totalCount={totalCount}
                variant={isFlipped ? 'dark' : 'light'}
                className={isFlipped ? 'rotate-y-180' : ''}
              />
            )}
            <FlashCardFront />
            <FlashCardBack
              className="absolute top-0 left-0 w-full h-full p-4"
              word={word}
              isFlipped={isFlipped}
              onScroll={handleExampleScroll}
            />
          </motion.div>
        </VerticalSwipeHandler>
      </div>

      <ProficiencySlider
        value={proficiency}
        onChange={handleProficiencyChange}
        onChangeComplete={handleProficiencyChangeComplete}
        disabled={!isAllRevealed}
        size="lg"
        className="bg-background p-4"
      />
    </motion.div>
  )
}

export default FlashCard
