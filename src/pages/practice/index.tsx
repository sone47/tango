import { useEffect } from 'react'

import CardPackConfigModal from '@/components/tango/CardPackConfigModal'
import CardPackSelector from '@/components/tango/CardPackSelector'
import { usePracticeStore } from '@/stores/practiceStore'
import { useWordPackStore } from '@/stores/wordPackStore'

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
