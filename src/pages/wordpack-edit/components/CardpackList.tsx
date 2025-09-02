import { isNil } from 'lodash'
import { Edit } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import Accordion from '@/components/Accordion'
import { cardPackService } from '@/services/cardPackService'
import { CardPack, Word, WordPack } from '@/types'

import WordItem from './WordItem'

interface CardpackListProps {
  wordPack?: WordPack | null
}

const CardpackList = ({ wordPack }: CardpackListProps) => {
  const [cardPacks, setCardPacks] = useState<CardPack[]>([])

  const activeCardPackId = useRef<number | null>(null)

  useEffect(() => {
    if (isNil(wordPack?.id)) return

    fetchCardPacks()
  }, [wordPack?.id])

  if (!wordPack) {
    return <div>Loading...</div>
  }

  const fetchCardPacks = async () => {
    const cardPacks = await cardPackService.getCardPacksByWordPackId(wordPack.id)
    setCardPacks(cardPacks)
  }

  const handleValueChange = (value: string) => {
    if (isNil(value)) return

    activeCardPackId.current = Number(value)

    const cardpack = document.getElementById(`cardpack-${value}`)
    if (cardpack) {
      // set 300ms is to avoid the animation of the accordion trigger
      // https://www.radix-ui.com/primitives/docs/components/accordion
      setTimeout(() => {
        cardpack.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }

  const handleEditWordSuccess = (updatedWord: Word) => {
    const cardPack = cardPacks.find((cardPack) => cardPack.id === updatedWord.cardPackId)
    if (cardPack) {
      cardPack.words = cardPack.words.map((word) =>
        word.id === updatedWord.id ? updatedWord : word
      )
      setCardPacks([...cardPacks])
    }
  }

  const handleEditCardPack = (cardPack: CardPack) => {
    toast.warning('🚧 施工中，敬请期待')
    console.log(cardPack)
  }

  const items = cardPacks.map((cardPack) => ({
    id: cardPack.id.toString(),
    title: (
      <div className="flex items-center gap-2" id={`cardpack-${cardPack.id}`}>
        {cardPack.name}
        <Edit
          className="w-4 h-4 text-primary cursor-pointer"
          onClick={(e) => {
            e.stopPropagation()
            handleEditCardPack(cardPack)
          }}
        />
      </div>
    ),
    content: (
      <div className="flex flex-col gap-4">
        {cardPack.words.map((word) => (
          <WordItem
            key={word.id}
            word={word}
            language={wordPack!.language}
            onEditSuccess={handleEditWordSuccess}
          />
        ))}
      </div>
    ),
  }))

  return (
    <Accordion
      items={items}
      onValueChange={handleValueChange}
      triggerClassName="text-lg items-center text-foreground"
    />
  )
}

export default CardpackList
