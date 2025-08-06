import { useCardPacks } from '@/hooks/useCardPacks'
import { cardPackService } from '@/services/cardPackService'
import { practiceService } from '@/services/practiceService'
import { usePracticeStore } from '@/stores/practiceStore'
import type { CardPack } from '@/types'
import { processWords } from '@/utils/practiceUtils'

import CardPackConfigModal from './components/CardPackConfigModal'
import CardPackSelector from './components/CardPackSelector'
import HistoryPool from './components/HistoryPool'
import PracticeContent from './components/PracticeContent'
import PracticeHeader from './components/PracticeHeader'

export default function PracticeTab() {
  const { cardPacks, loading: cardPacksLoading, hasData } = useCardPacks()

  const {
    selectedCardPack,
    proficiency,
    currentWordIndex,
    shuffledWords,
    showCardPackSelector,
    studiedWords,
    showCardPackConfig,
    tempSelectedCardPack,
    showHistoryPool,
    updateState,
    resetRevealState,
  } = usePracticeStore()

  const handleCardPackSelect = async (cardPack: CardPack) => {
    const fullCardPack = await cardPackService.getCardPackWithWordsById(cardPack.id)
    if (fullCardPack) {
      await practiceService.createPracticesForWords(fullCardPack.words)

      updateState({
        tempSelectedCardPack: fullCardPack,
        showCardPackSelector: false,
        showCardPackConfig: true,
      })
    }
  }

  const handleCardPackConfigConfirm = async (shouldShuffle: boolean, proficiency: number) => {
    await applyCardPackConfig(shouldShuffle, proficiency)
  }

  const applyCardPackConfig = async (shouldShuffle = false, proficiency = 0) => {
    if (tempSelectedCardPack) {
      const vocabularyIds = tempSelectedCardPack.words.map((word) => word.id)
      const practices = await practiceService.getPracticesByVocabularyIds(vocabularyIds)
      const finalWords = processWords(
        tempSelectedCardPack.words,
        practices,
        proficiency,
        shouldShuffle
      )

      updateState({
        selectedCardPack: tempSelectedCardPack,
        shuffledWords: finalWords,
        currentWordIndex: 0,
        studiedWords: [],
        tempSelectedCardPack: null,
        showCardPackConfig: false,
        proficiency,
      })
      resetRevealState()
    }
  }

  const handleCardPackConfigCancel = () => {
    updateState({
      tempSelectedCardPack: null,
      showCardPackConfig: false,
    })
  }

  const handleWordStudy = () => {
    updateState({
      studiedWords: [...studiedWords, shuffledWords[currentWordIndex]],
      currentWordIndex: currentWordIndex + 1,
    })
    resetRevealState()
  }

  const handleCardPackReset = async () => {
    if (selectedCardPack) {
      const vocabularyIds = selectedCardPack.words.map((word) => word.id)
      const practices = await practiceService.getPracticesByVocabularyIds(vocabularyIds)
      const finalWords = processWords(selectedCardPack.words, practices, proficiency, false)

      updateState({
        shuffledWords: finalWords,
        currentWordIndex: 0,
        studiedWords: [],
      })
      resetRevealState()
    }
  }

  const handleCardPackShuffle = async () => {
    if (selectedCardPack) {
      const vocabularyIds = selectedCardPack.words.map((word) => word.id)
      const practices = await practiceService.getPracticesByVocabularyIds(vocabularyIds)
      const finalWords = processWords(selectedCardPack.words, practices, 0, true)

      updateState({
        shuffledWords: finalWords,
        currentWordIndex: 0,
        studiedWords: [],
        proficiency: 0,
      })
      resetRevealState()
    }
  }

  return (
    <div className="h-full flex flex-col">
      <PracticeHeader
        selectedCardPack={selectedCardPack}
        hasData={hasData}
        onSelectCardPack={() => updateState({ showCardPackSelector: true })}
        onShowHistoryPool={() => updateState({ showHistoryPool: true })}
      />

      <PracticeContent
        selectedCardPack={selectedCardPack}
        shuffledWords={shuffledWords}
        currentWordIndex={currentWordIndex}
        onSelectCardPack={() => updateState({ showCardPackSelector: true })}
        onWordStudy={handleWordStudy}
        onReset={handleCardPackReset}
        onShuffle={handleCardPackShuffle}
      />

      <CardPackSelector
        isOpen={showCardPackSelector}
        onClose={() => updateState({ showCardPackSelector: false })}
        onSelectCardPack={handleCardPackSelect}
        cardPacks={cardPacks}
        loading={cardPacksLoading}
        hasData={hasData}
      />

      <HistoryPool
        isOpen={showHistoryPool}
        onClose={() => updateState({ showHistoryPool: false })}
        studiedWords={studiedWords}
      />

      {showCardPackConfig && tempSelectedCardPack && (
        <CardPackConfigModal
          isOpen={showCardPackConfig}
          cardPack={tempSelectedCardPack}
          onConfirm={handleCardPackConfigConfirm}
          onCancel={handleCardPackConfigCancel}
        />
      )}
    </div>
  )
}
