import { useEffect } from 'react'

import { usePracticeStore } from '@/stores/practiceStore'
import { useWordPackStore } from '@/stores/wordPackStore'

import CardPackConfigModal from './components/CardPackConfigModal'
import CardPackSelector from './components/CardPackSelector'
import Content from './components/Content'

export default function PracticeTab() {
  const { fetchWordPacks } = useWordPackStore()

  const { selectedCardPack, updateState, resetPracticeState } = usePracticeStore()

  useEffect(() => {
    resetPracticeState()

    if (!selectedCardPack) {
      updateState({ showCardPackSelector: true })
    }

    fetchWordPacks()
  }, [])

  return (
    <>
      <Content />
      <CardPackSelector />
      <CardPackConfigModal />
    </>
  )
}
