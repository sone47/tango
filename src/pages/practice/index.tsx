import { useEffect } from 'react'

import { cardPackService } from '@/services/cardPackService'
import { practiceService } from '@/services/practiceService'
import { usePracticeStore } from '@/stores/practiceStore'
import { useWordPackStore } from '@/stores/wordPackStore'
import type { CardPack } from '@/types'
import { processWords } from '@/utils/practiceUtils'

import CardPackConfigModal from './components/CardPackConfigModal'
import CardPackSelector from './components/CardPackSelector'
import HistoryPool from './components/HistoryPool'
import PracticeContent from './components/PracticeContent'
import PracticeHeader from './components/PracticeHeader'

export default function PracticeTab() {
  const { fetchWordPacks } = useWordPackStore()

  const {
    selectedCardPack,
    currentWordIndex,
    shuffledWords,
    showCardPackSelector,
    studiedWords,
    showCardPackConfig,
    tempSelectedCardPack,
    showHistoryPool,
    updateState,
  } = usePracticeStore()

  useEffect(() => {
    if (!selectedCardPack) {
      updateState({ showCardPackSelector: true })
    }

    fetchWordPacks()
  }, [])

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
    }
  }

  const handleCardPackConfigCancel = () => {
    updateState({
      tempSelectedCardPack: null,
      showCardPackConfig: false,
    })
  }

  return (
    <div className="h-full flex flex-col">
      <PracticeHeader />

      <PracticeContent
        selectedCardPack={selectedCardPack}
        shuffledWords={shuffledWords}
        currentWordIndex={currentWordIndex}
      />

      <CardPackSelector
        isOpen={showCardPackSelector}
        onClose={() => updateState({ showCardPackSelector: false })}
        onSelectCardPack={handleCardPackSelect}
      />

      <HistoryPool
        isOpen={showHistoryPool}
        onClose={() => updateState({ showHistoryPool: false })}
        studiedWords={studiedWords}
      />

      {tempSelectedCardPack && (
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
