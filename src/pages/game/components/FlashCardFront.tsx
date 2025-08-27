import { useRef } from 'react'

import Speak from '@/components/Speak'
import { FlashCardItemEnum, FlashCardItemNameMap } from '@/constants/flashCard'
import { LanguageEnum, PartOfSpeechEnum, partOfSpeechToLanguageMap } from '@/constants/language'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { useSettings } from '@/hooks/useSettings'
import { usePracticeStore } from '@/stores/practiceStore'
import { CardRevealState } from '@/types'

import RevealOverlay from './RevealOverlay'

const cardItemNames = Object.keys(FlashCardItemNameMap) as (keyof typeof FlashCardItemNameMap)[]

const FlashCardFront = () => {
  const { settings } = useSettings()
  const { currentWordIndex, revealState, updateState, shuffledWords } = usePracticeStore()
  const { currentWordPack } = useCurrentWordPack()

  const word = shuffledWords[currentWordIndex]
  const partOfSpeechMap = partOfSpeechToLanguageMap[currentWordPack?.language as LanguageEnum] ?? {}

  const isDraggingRef = useRef<Record<keyof CardRevealState, boolean>>({
    phonetic: false,
    word: false,
    definition: false,
  })

  const isFirstCard = currentWordIndex === 0
  const isAllRevealed = cardItemNames.every((name) => revealState[name])
  const guideItemName = cardItemNames.find(
    (key) => !settings.practice.hiddenInCard.includes(key as keyof typeof FlashCardItemNameMap)
  )

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
    <div className="absolute top-0 left-0 w-full h-full p-4 backface-hidden flex flex-col">
      {/* 内容区域 */}
      <div className="flex-1 flex flex-col justify-center space-y-8 min-h-0">
        {word.word && (
          <Speak
            text={word.word}
            audioUrl={word.wordAudio}
            autoPlay={settings.practice.isAutoPlayAudio}
            size="xxl"
          />
        )}
        <RevealOverlay
          isRevealed={revealState.phonetic}
          label="音标"
          colorScheme="blue"
          onDragStart={() => handleRevealDragStart(FlashCardItemEnum.phonetic)}
          onDragEnd={(offsetX) => handleRevealDragEnd(FlashCardItemEnum.phonetic, offsetX)}
          showGuide={isFirstCard && guideItemName === FlashCardItemEnum.phonetic}
        >
          <div className="flex items-center justify-center gap-2 h-12">
            <span className="text-xl font-medium text-gray-800">{word.phonetic}</span>
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
          <div className="flex items-center justify-center h-16">
            <span className="text-3xl font-bold text-gray-900">{word.word}</span>
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
          <div className="flex items-center justify-center h-12">
            <span className="text-lg text-gray-700">
              {word.partOfSpeech === PartOfSpeechEnum.unknown
                ? ''
                : `[${partOfSpeechMap[word.partOfSpeech]}]`}
              {word.definition}
            </span>
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
  )
}

export default FlashCardFront
