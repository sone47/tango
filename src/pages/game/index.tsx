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
      <div className="h-full flex flex-col">
        <PracticeHeader />
        <PracticeContent />
      </div>
      <HistoryPool />
    </>
  )
}
