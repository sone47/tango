import { useEffect } from 'react'

import { usePracticeStore } from '@/stores/practiceStore'
import { useWordPackStore } from '@/stores/wordPackStore'

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
    studiedWords,
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

  return (
    <div className="h-full flex flex-col">
      <PracticeHeader />

      <PracticeContent
        selectedCardPack={selectedCardPack}
        shuffledWords={shuffledWords}
        currentWordIndex={currentWordIndex}
      />

      <CardPackSelector />

      <HistoryPool
        isOpen={showHistoryPool}
        onClose={() => updateState({ showHistoryPool: false })}
        studiedWords={studiedWords}
      />

      {tempSelectedCardPack && <CardPackConfigModal cardPack={tempSelectedCardPack} />}
    </div>
  )
}
