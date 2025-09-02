import { useLastestData } from '@/hooks/useLastestData'
import { CardPack } from '@/types'

import CardPackItem from './CardPackItem'

interface CardPackListProps {
  cardPacks: (CardPack & { progress: number })[]
}

const CardPackList = ({ cardPacks }: CardPackListProps) => {
  const { cardPackId: latestCardPackId } = useLastestData()

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
