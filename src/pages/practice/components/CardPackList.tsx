import { useEffect } from 'react'

import EmptyWordPack from '@/components/EmptyWordPack'
import Loading from '@/components/Loading'
import { useCardPacks } from '@/hooks/useCardPacks'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { useLastestData } from '@/hooks/useLastestData'
import { useWordPackStore } from '@/stores/wordPackStore'

import CardPackItem from './CardPackItem'

const CardPackList = () => {
  const { cardPacks, loading, fetchCardPacks } = useCardPacks()
  const { hasData } = useWordPackStore()
  const { currentWordPack } = useCurrentWordPack()
  const { cardPackId: latestCardPackId } = useLastestData()

  useEffect(() => {
    if (currentWordPack) {
      fetchCardPacks(currentWordPack.id)
    }
  }, [currentWordPack])

  if (loading) {
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
    <div className="flex flex-col gap-9 py-4">
      {cardPacks.map((cardPack) => (
        <CardPackItem
          key={cardPack.id}
          cardPack={cardPack}
          isActive={cardPack.id === latestCardPackId}
        />
      ))}
    </div>
  )
}

export default CardPackList
