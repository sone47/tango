import { useEffect, useRef } from 'react'

import Speak, { SpeakRef } from '@/components/Speak'
import Typography from '@/components/Typography'
import { FlashCardItemEnum, FlashCardItemNameMap } from '@/constants/flashCard'
import { LanguageEnum } from '@/constants/language'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { usePartOfSpeechText } from '@/hooks/usePartOfSpeechText'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils'
import { usePracticeStore } from '@/stores/practiceStore'
import { CardRevealState } from '@/types'

import RevealOverlay from './RevealOverlay'

const cardItemNames = Object.keys(FlashCardItemNameMap) as (keyof typeof FlashCardItemNameMap)[]

interface FlashCardFrontProps {
  isFlipped: boolean
  onAudioLoaded?: () => void
}

const FlashCardFront = ({ isFlipped, onAudioLoaded }: FlashCardFrontProps) => {
  const { settings } = useSettings()
  const { currentWordIndex, revealState, updateState, shuffledWords } = usePracticeStore()
  const { currentWordPack } = useCurrentWordPack()
  const { getPartOfSpeechText } = usePartOfSpeechText(currentWordPack?.language as LanguageEnum)

  const word = shuffledWords[currentWordIndex]

  const isDraggingRef = useRef<Record<keyof CardRevealState, boolean>>(revealState)
  const speakRef = useRef<SpeakRef>(null)

  const isFirstCard = currentWordIndex === 0
  const isAllRevealed = cardItemNames.every((name) => revealState[name])
  const guideItemName = cardItemNames.find(
    (key) => !settings.practice.hiddenInCard.includes(key as keyof typeof FlashCardItemNameMap)
  )

  useEffect(() => {
    if (isFlipped) {
      speakRef.current?.stop()
    }
  }, [isFlipped])

  const handleRevealDragStart = (field: keyof CardRevealState) => {
    isDraggingRef.current[field] = true
  }

  const handleRevealDragEnd = (field: keyof CardRevealState, offsetX: number) => {
    isDraggingRef.current[field] = false

    // 只在拖拽结束时且达到阈值时才触发reveal
    if (Math.abs(offsetX) >= 80 && !revealState[field]) {
      handleRevealStateChange({
        ...revealState,
        [field]: true,
      })
    }
  }

  const handleRevealStateChange = (newRevealState: CardRevealState) => {
    updateState({ revealState: newRevealState })
  }

  return (
    <div
      className={cn(
        'absolute top-0 left-0 w-full h-full p-4 backface-hidden flex flex-col',
        isFlipped ? 'opacity-0' : ''
      )}
    >
      {/* 内容区域 */}
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center space-y-8">
        {word.word && (
          <Speak
            ref={speakRef}
            text={word.word}
            audioUrl={word.wordAudio}
            autoPlay={settings.practice.isAutoPlayAudio && !isFlipped}
            size="2xl"
            buttonProps={{
              variant: 'primary',
              className: '!size-10 !p-8 rounded-2xl',
            }}
            onPlayAvailable={onAudioLoaded}
          />
        )}
        <div className="w-full space-y-4">
          <RevealOverlay
            isRevealed={revealState.phonetic}
            label="音标"
            colorScheme="blue"
            onDragStart={() => handleRevealDragStart(FlashCardItemEnum.phonetic)}
            onDragEnd={(offsetX) => handleRevealDragEnd(FlashCardItemEnum.phonetic, offsetX)}
            showGuide={isFirstCard && guideItemName === FlashCardItemEnum.phonetic}
          >
            <div className="flex h-12 items-center justify-center gap-2">
              <span
                className={cn(
                  'text-xl font-medium text-gray-800',
                  !revealState.phonetic && 'truncate'
                )}
              >
                {word.phonetic}
              </span>
            </div>
          </RevealOverlay>

          <RevealOverlay
            isRevealed={revealState.word}
            label="写法"
            colorScheme="purple"
            onDragStart={() => handleRevealDragStart(FlashCardItemEnum.word)}
            onDragEnd={(offsetX) => handleRevealDragEnd(FlashCardItemEnum.word, offsetX)}
            showGuide={isFirstCard && guideItemName === FlashCardItemEnum.word}
          >
            <div className="flex h-16 items-center justify-center">
              <span
                className={cn('text-3xl font-bold text-gray-900', !revealState.word && 'truncate')}
              >
                {word.word}
              </span>
            </div>
          </RevealOverlay>

          <RevealOverlay
            isRevealed={revealState.definition}
            label="释义"
            colorScheme="emerald"
            onDragStart={() => handleRevealDragStart(FlashCardItemEnum.definition)}
            onDragEnd={(offsetX) => handleRevealDragEnd(FlashCardItemEnum.definition, offsetX)}
            showGuide={isFirstCard && guideItemName === FlashCardItemEnum.definition}
          >
            <div className="flex h-12 items-center justify-center">
              <span className={cn('text-lg text-gray-700', !revealState.definition && 'truncate')}>
                {getPartOfSpeechText(word.partOfSpeech)
                  ? `[${getPartOfSpeechText(word.partOfSpeech)}]`
                  : ''}
                {word.definition}
              </span>
            </div>
          </RevealOverlay>
        </div>
      </div>

      {/* 底部提示 */}
      <Typography.Text
        type="secondary"
        size="xs"
        className="flex shrink-0 flex-col items-center gap-1"
      >
        {isAllRevealed ? (
          <>
            <span>点击卡片查看例句</span>
            <span>上滑「已掌握」· 下滑「未掌握」</span>
          </>
        ) : (
          <span>双击卡片快速显示所有内容</span>
        )}
      </Typography.Text>
    </div>
  )
}

export default FlashCardFront
