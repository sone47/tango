import { useEffect } from 'react'

import CardPackConfigModal from '@/components/tango/CardPackConfigModal'
import CardPackSelector from '@/components/tango/CardPackSelector'
import { useWordPackStore } from '@/stores/wordPackStore'

import HistoryPool from './components/HistoryPool'
import PracticeContent from './components/PracticeContent'
import PracticeHeader from './components/PracticeHeader'

export default function GamePage() {
  const { fetchWordPacks } = useWordPackStore()

  useEffect(() => {
    fetchWordPacks()
  }, [])

  return (
    <>
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <PracticeHeader />
        <PracticeContent />
      </div>
      <CardPackSelector />
      <HistoryPool />
      <CardPackConfigModal />
    </>
  )
}
