import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { usePracticeStore } from '@/stores/practiceStore'

import HistoryPool from './components/HistoryPool'
import PracticeContent from './components/PracticeContent'
import PracticeHeader from './components/PracticeHeader'

export default function GamePage() {
  const navigate = useNavigate()
  const { selectedCardPack } = usePracticeStore()

  useEffect(() => {
    if (!selectedCardPack) {
      navigate('/', { replace: true })
    }
  }, [selectedCardPack])

  return (
    <>
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
        <PracticeHeader />
        <PracticeContent />
      </div>
      <HistoryPool />
    </>
  )
}
