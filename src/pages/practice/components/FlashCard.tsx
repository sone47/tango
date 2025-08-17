import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import ProficiencySlider from '@/components/ProficiencySlider'
import { useSettings } from '@/hooks/useSettings'
import { practiceService } from '@/services/practiceService'
import { usePracticeStore } from '@/stores/practiceStore'
import type { CardRevealState, Word } from '@/types'
import { textToSpeech } from '@/utils/speechUtils'

import ProgressIndicator from './ProgressIndicator'
import RevealOverlay from './RevealOverlay'
import VerticalSwipeHandler from './VerticalSwipeHandler'

interface FlashCardProps {
  word: Word
  revealState: CardRevealState
  onRevealStateChange: (state: CardRevealState) => void
  currentIndex?: number
  totalCount?: number
}

const FlashCard = ({
  word,
  revealState,
  onRevealStateChange,
  currentIndex,
  totalCount,
}: FlashCardProps) => {
  const cardItemNames = ['phonetic', 'word', 'definition'] as const

  const { settings } = useSettings()
  const { updateState, studiedWords, currentWordIndex, shuffledWords } = usePracticeStore()

  const [isFlipped, setIsFlipped] = useState(false)
  const [proficiency, setProficiency] = useState(0)
  const [isManualUpdateProficiency, setIsManualUpdateProficiency] = useState(false)

  const isDraggingRef = useRef<Record<keyof CardRevealState, boolean>>({
    phonetic: false,
    word: false,
    definition: false,
  })

  useEffect(() => {
    practiceService.getPracticeByVocabularyId(word.id).then((practice) => {
      setProficiency(practice?.proficiency ?? 0)
    })

    resetRevealState()
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

  const handleCardFlip = () => {
    if (isAllRevealed) {
      setIsFlipped(!isFlipped)
    }
  }

  const handleDoubleClick = () => {
    if (!isAllRevealed) {
      onRevealStateChange({
        phonetic: true,
        word: true,
        definition: true,
      })
    }
  }

  const handleSwipeUp = () => {
    const newProficiency = Math.min(100, proficiency + (isManualUpdateProficiency ? 0 : 14))

    autoUpdateProficiency(newProficiency)

    toast.success(`已掌握 ${newProficiency}%`, {
      duration: 1000,
    })

    goToNextCard()
  }

  const handleSwipeDown = () => {
    const newProficiency = Math.max(0, proficiency - (isManualUpdateProficiency ? 0 : 14))

    autoUpdateProficiency(newProficiency)

    toast.error('未掌握', {
      duration: 600,
    })

    goToNextCard()
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

    handlePlayAudio(word.phonetic, word.wordAudio)
  }

  const handlePlayExampleAudio = (event: React.MouseEvent) => {
    event.stopPropagation()

    handlePlayAudio(word.example, word.exampleAudio)
  }

  return (
    <motion.div
      className="w-full max-w-sm mx-auto h-full flex flex-col"
      key={word.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
    >
      {/* 卡片容器 */}
      <div className="relative flex-1 perspective-1000 min-h-0">
        <VerticalSwipeHandler
          enabled={isAllRevealed}
          onSwipeUp={handleSwipeUp}
          onSwipeDown={handleSwipeDown}
          className="absolute inset-0 w-full h-full"
        >
          <motion.div
            className={`w-full h-full transform-style-preserve-3d transition-transform duration-500 ${
              isFlipped ? 'rotate-y-180' : ''
            }`}
            onClick={handleCardFlip}
            onDoubleClick={handleDoubleClick}
          >
            {/* 正面 */}
            <div className="absolute inset-0 w-full h-full backface-hidden bg-white rounded-3xl shadow-2xl p-4 flex flex-col">
              {/* 学习进度 - 正面 */}
              {currentIndex !== undefined && totalCount !== undefined && (
                <ProgressIndicator
                  currentIndex={currentIndex}
                  totalCount={totalCount}
                  variant="light"
                />
              )}

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
                    {word.phonetic && (
                      <Button
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-xs text-gray-500 mb-2 flex-shrink-0 space-y-1"
              >
                {isAllRevealed ? (
                  <>
                    <div>点击卡片查看例句</div>
                    <div>上滑「已掌握」· 下滑「未掌握」</div>
                  </>
                ) : (
                  <div>双击卡片快速显示所有内容</div>
                )}
              </motion.div>
            </div>

            {/* 背面 */}
            <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl shadow-2xl p-4 flex flex-col">
              {/* 学习进度 - 背面 */}
              {currentIndex !== undefined && totalCount !== undefined && (
                <ProgressIndicator
                  currentIndex={currentIndex}
                  totalCount={totalCount}
                  variant="dark"
                />
              )}

              <div className="flex-1 flex flex-col justify-center min-h-0">
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center">
                    <h3 className="text-lg font-semibold text-gray-800">例句</h3>
                    {word.example && (
                      <Button
                        onClick={handlePlayExampleAudio}
                        variant="ghost"
                        size="sm"
                        icon={Volume2}
                      ></Button>
                    )}
                  </div>
                  <div className="bg-white/80 p-4 rounded-2xl">
                    {word.example ? (
                      <p className="text-base leading-relaxed text-gray-800">
                        <span className="text-gray-500">{word.example}</span>
                      </p>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 text-base">暂无例句</p>
                        <p className="text-gray-400 text-sm mt-2">该词汇还没有添加例句</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500 mb-2 flex-shrink-0">
                点击返回正面
              </div>
            </div>
          </motion.div>
        </VerticalSwipeHandler>
      </div>

      {/* 熟练度控制 */}
      <ProficiencySlider
        value={proficiency}
        onChange={handleProficiencyChange}
        onChangeComplete={handleProficiencyChangeComplete}
        disabled={!isAllRevealed}
        size="lg"
        className="mt-2 bg-white/80 p-4"
      />
    </motion.div>
  )
}

export default FlashCard
