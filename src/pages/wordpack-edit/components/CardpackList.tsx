import { isNil } from 'lodash'
import { useEffect, useRef, useState } from 'react'

import Accordion from '@/components/Accordion'
import { cardPackService } from '@/services/cardPackService'
import { wordPackService } from '@/services/wordPackService'
import { CardPack, Word, WordPack } from '@/types'

import WordItem from './WordItem'

interface CardpackListProps {
  wordPackId: number
}

const CardpackList = ({ wordPackId }: CardpackListProps) => {
  const [wordPack, setWordPack] = useState<WordPack | null>(null)
  const [cardPacks, setCardPacks] = useState<CardPack[]>([])

  const activeCardPackId = useRef<number | null>(null)

  const fetchWordPack = async () => {
    const wordPack = await wordPackService.getWordPackById(wordPackId)
    setWordPack(wordPack)
  }

  const fetchCardPacks = async () => {
    const cardPacks = await cardPackService.getCardPacksByWordPackId(wordPackId)
    setCardPacks(cardPacks)
  }

  useEffect(() => {
    fetchWordPack()
    fetchCardPacks()
  }, [wordPackId])

  if (!wordPack) {
    return <div>Loading...</div>
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

  const handleEditSuccess = (updatedWord: Word) => {
    const cardPack = cardPacks.find((cardPack) => cardPack.id === updatedWord.cardPackId)
    if (cardPack) {
      cardPack.words = cardPack.words.map((word) =>
        word.id === updatedWord.id ? updatedWord : word
      )
      setCardPacks([...cardPacks])
    }
  }

  const items = cardPacks.map((cardPack) => ({
    id: cardPack.id.toString(),
    title: cardPack.name,
    content: (
      <div id={`cardpack-${cardPack.id}`} className="flex flex-col gap-4">
        {cardPack.words.map((word) => (
          <WordItem
            key={word.id}
            word={word}
            language={wordPack!.language}
            onEditSuccess={handleEditSuccess}
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
