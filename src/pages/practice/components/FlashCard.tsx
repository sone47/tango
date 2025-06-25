import { motion } from 'framer-motion'
import { Volume2 } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

import Button from '@/components/Button'
import ProficiencySlider from '@/components/ProficiencySlider'
import { practiceService } from '@/services/practiceService'
import type { CardRevealState, Word } from '@/types'

import ProgressIndicator from './ProgressIndicator'
import RevealOverlay from './RevealOverlay'
import VerticalSwipeHandler from './VerticalSwipeHandler'

interface FlashCardProps {
  word: Word
  revealState: CardRevealState
  onRevealStateChange: (state: CardRevealState) => void
  onNextCard: () => void
  isFirstCard?: boolean
  currentIndex?: number
  totalCount?: number
}

const FlashCard = ({
  word,
  revealState,
  onRevealStateChange,
  onNextCard,
  isFirstCard = false,
  currentIndex,
  totalCount,
}: FlashCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const [proficiency, setProficiency] = useState(0)

  const handleWordChange = useCallback(async () => {
    const practice = await practiceService.getPracticeByVocabularyId(word.id)
    setProficiency(practice?.proficiency ?? 0)
  }, [word.id])

  useEffect(() => {
    handleWordChange()
  }, [handleWordChange])

  // 使用ref来避免拖拽过程中的状态冲突
  const isDraggingRef = useRef<Record<keyof CardRevealState, boolean>>({
    phonetic: false,
    word: false,
    definition: false,
  })

  const allRevealed = revealState.phonetic && revealState.word && revealState.definition

  const goToNextCard = async (newProficiency: number) => {
    practiceService.updatePractice(word.id, { proficiency: newProficiency })

    onNextCard()
    setIsFlipped(false)
  }

  const handleCardFlip = () => {
    if (allRevealed) {
      setIsFlipped(!isFlipped)
    }
  }

  const handleDoubleClick = () => {
    if (!allRevealed) {
      onRevealStateChange({
        phonetic: true,
        word: true,
        definition: true,
      })
    }
  }

  const handleSwipeUp = () => {
    const newProficiency = Math.min(100, proficiency + 14)
    goToNextCard(newProficiency)
  }

  const handleSwipeDown = () => {
    const newProficiency = Math.max(0, proficiency - 14)
    goToNextCard(newProficiency)
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
    if (!allRevealed) return
    setProficiency(value)
  }

  const handlePlayAudio = (event: React.MouseEvent) => {
    event.stopPropagation()

    const audio = new Audio(word.wordAudio)
    audio.play()
  }

  // 准备滑动提示组件
  const upHint = (
    <div className="bg-green-100 text-green-700 px-6 py-3 rounded-2xl font-medium shadow-lg">
      ✓ 已掌握
    </div>
  )

  const downHint = (
    <div className="bg-red-100 text-red-700 px-6 py-3 rounded-2xl font-medium shadow-lg">
      ✗ 未掌握
    </div>
  )

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
          enabled={allRevealed}
          onSwipeUp={handleSwipeUp}
          onSwipeDown={handleSwipeDown}
          upHint={upHint}
          downHint={downHint}
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
                  showGuide={isFirstCard && !revealState.phonetic}
                >
                  <div className="flex items-center justify-center gap-2 h-12">
                    <span className="text-xl font-medium text-gray-800">{word.phonetic}</span>
                    {word.wordAudio && (
                      <Button
                        onClick={handlePlayAudio}
                        variant="ghost"
                        size="sm"
                        icon={Volume2}
                        className="!p-1.5 !min-w-0 !w-auto !h-auto bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
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
                {allRevealed ? (
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
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">例句</h3>
                  <div className="bg-white/80 p-4 rounded-2xl">
                    {word.example ? (
                      <p className="text-base leading-relaxed text-gray-800">{word.example}</p>
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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mt-2 bg-white/80 backdrop-blur-sm rounded-2xl p-2 transition-opacity duration-300 flex-shrink-0 ${
          !allRevealed ? 'opacity-50' : 'opacity-100'
        }`}
      >
        <ProficiencySlider
          value={proficiency}
          onChange={handleProficiencyChange}
          disabled={!allRevealed}
          size="md"
        />
      </motion.div>
    </motion.div>
  )
}

export default FlashCard
