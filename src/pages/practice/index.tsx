import { isNil } from 'lodash'
import { useEffect, useState } from 'react'

import EmptyWordPack from '@/components/EmptyWordPack'
import Loading from '@/components/Loading'
import { useCardPacks } from '@/hooks/useCardPacks'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { useLastestData } from '@/hooks/useLastestData'
import { usePracticeStore } from '@/stores/practiceStore'
import { useWordPackStore } from '@/stores/wordPackStore'

import CardPackConfigModal from './components/CardPackConfigModal'
import CardPackList from './components/CardPackList'

export default function PracticeTab() {
  const { fetchWordPacks, hasData, loading: fetchWordPacksLoading } = useWordPackStore()
  const { currentWordPackId } = useCurrentWordPack()
  const { resetPracticeState } = usePracticeStore()
  const { cardPackId: latestCardPackId } = useLastestData()
  const { cardPacks, loading: fetchCardPacksLoading, fetchCardPacks } = useCardPacks()

  const [hasInit, setHasInit] = useState(false)

  useEffect(() => {
    resetPracticeState()

    fetchData()
  }, [])

  const fetchData = async () => {
    await fetchWordPacks()
    await fetchCardPacks(currentWordPackId)
    setHasInit(true)
  }

  if (fetchWordPacksLoading || fetchCardPacksLoading || !hasInit) {
    return (
      <div className="h-full">
        <Loading text="加载卡包中..." size="md" />
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="h-full pb-4">
        <EmptyWordPack showImportButton />
      </div>
    )
  }

  return (
    <>
      {(isNil(latestCardPackId) ||
        !cardPacks.find((cardPack) => cardPack.id === latestCardPackId)) && (
        <div className="bg-card text-primary/90 mb-4 rounded-full p-2 text-center font-bold shadow-lg">
          选择卡包，开始学习吧~
        </div>
      )}
      <CardPackList cardPacks={cardPacks} />
      <CardPackConfigModal />
    </>
  )
}
