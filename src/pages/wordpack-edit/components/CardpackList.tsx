import { isNil } from 'lodash'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import Accordion from '@/components/Accordion'
import { cardPackService } from '@/services/cardPackService'
import { CardPack, Word, WordPack } from '@/types'

import TextEditor from './TextEditor'
import WordItem from './WordItem'

interface CardpackListProps {
  wordPack?: WordPack | null
}

const CardpackList = ({ wordPack }: CardpackListProps) => {
  const [cardPacks, setCardPacks] = useState<CardPack[]>([])
  const [editingCardPackIds, setEditingCardPackIds] = useState<number[]>([])

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

  const handleCardPackNameConfirm = async (id: number, newName: string) => {
    try {
      await cardPackService.updateCardPack(id, { name: newName })
      setEditingCardPackIds(editingCardPackIds.filter((id) => id !== id))
    } catch {
      toast.error('更新卡包名称失败')
    }
  }

  const handleEditCardPackId = (editId: number, isEdit: boolean) => {
    if (isEdit) {
      setEditingCardPackIds([...editingCardPackIds, editId])
    } else {
      setEditingCardPackIds(editingCardPackIds.filter((id) => id !== editId))
    }
  }

  const items = cardPacks.map((cardPack) => ({
    id: cardPack.id.toString(),
    title: (
      <div className="flex items-center gap-2" id={`cardpack-${cardPack.id}`}>
        <TextEditor
          isEdit={editingCardPackIds.includes(cardPack.id)}
          value={cardPack.name}
          onConfirm={(newName) => handleCardPackNameConfirm(cardPack.id, newName)}
          onEditStateChange={(isEdit) => handleEditCardPackId(cardPack.id, isEdit)}
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
