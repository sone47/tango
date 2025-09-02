import { isNil } from 'lodash'
import { useEffect } from 'react'

import { useLastestData } from '@/hooks/useLastestData'
import { usePracticeStore } from '@/stores/practiceStore'
import { useWordPackStore } from '@/stores/wordPackStore'

import CardPackConfigModal from './components/CardPackConfigModal'
import CardPackList from './components/CardPackList'

export default function PracticeTab() {
  const { fetchWordPacks } = useWordPackStore()
  const { resetPracticeState } = usePracticeStore()
  const { cardPackId: latestCardPackId } = useLastestData()

  useEffect(() => {
    resetPracticeState()

    fetchWordPacks()
  }, [])

  return (
    <>
      {isNil(latestCardPackId) && (
        <div className="bg-background text-primary/90 p-2 shadow-lg rounded-full text-center font-bold mb-4">
          选择卡包，开始学习吧~
        </div>
      )}
      <CardPackList />
      <CardPackConfigModal />
    </>
  )
}
