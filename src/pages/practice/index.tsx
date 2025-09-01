import { useEffect } from 'react'

import { usePracticeStore } from '@/stores/practiceStore'
import { useWordPackStore } from '@/stores/wordPackStore'

import CardPackConfigModal from './components/CardPackConfigModal'
import CardPackList from './components/CardPackList'

export default function PracticeTab() {
  const { fetchWordPacks } = useWordPackStore()

  const { resetPracticeState } = usePracticeStore()

  useEffect(() => {
    resetPracticeState()

    fetchWordPacks()
  }, [])

  return (
    <>
      <CardPackList />
      <CardPackConfigModal />
    </>
  )
}
