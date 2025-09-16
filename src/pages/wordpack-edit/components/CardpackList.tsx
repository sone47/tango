import { isNil } from 'lodash'
import { FolderSearch, Trash2 } from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { toast } from 'sonner'

import Accordion from '@/components/Accordion'
import AlertDialog from '@/components/AlertDialog'
import Button from '@/components/Button'
import Loading from '@/components/Loading'
import Typography from '@/components/Typography'
import { cardPackService } from '@/services/cardPackService'
import { CardPack, Word, WordPackEntity } from '@/types'

import TextEditor from './TextEditor'
import WordItem from './WordItem'

interface CardpackListProps {
  wordPack?: WordPackEntity | null
  editable: boolean
  onAddCardPack: () => void
  onAddWord: (cardPackId: number) => void
}

export interface CardpackListRef {
  scrollToCardPack: (cardPackId: number) => void
  appendCardPack: (cardPack: CardPack) => void
}

const CardpackList = forwardRef<CardpackListRef, CardpackListProps>(
  ({ wordPack, editable, onAddCardPack, onAddWord }, ref) => {
    const [cardPacks, setCardPacks] = useState<CardPack[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [editingCardPackIds, setEditingCardPackIds] = useState<number[]>([])
    const [activeCardPackId, setActiveCardPackId] = useState<number | null>(null)

    const fetchCardPacks = async (wordPackId: number) => {
      setIsLoading(true)
      try {
        const cardPacks = await cardPackService.getCardPacksByWordPackId(wordPackId)
        setCardPacks(cardPacks)
      } finally {
        setIsLoading(false)
      }
    }

    useEffect(() => {
      if (isNil(wordPack?.id)) return

      fetchCardPacks(wordPack.id)
    }, [wordPack?.id])

    useEffect(() => {
      if (cardPacks.length === 1) {
        setActiveCardPackId(cardPacks[0].id)
      }
    }, [cardPacks])

    const scrollToCardPack = (cardPackId: number) => {
      const cardpack = document.getElementById(`cardpack-${cardPackId}`)
      if (cardpack) {
        // set 300ms is to avoid the animation of the accordion trigger
        // https://www.radix-ui.com/primitives/docs/components/accordion
        setTimeout(() => {
          cardpack.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }, 300)
      }
    }

    const appendCardPack = (cardPack: CardPack) => {
      setCardPacks([...cardPacks, cardPack])
    }

    useImperativeHandle(ref, () => ({
      scrollToCardPack,
      appendCardPack,
    }))

    if (isLoading) {
      return <Loading />
    }

    if (!cardPacks.length) {
      return (
        <div className="flex h-full flex-col items-center justify-center">
          <FolderSearch className="mb-4 h-12 w-12 text-gray-400" />
          <Typography.Title level={5}>暂无卡包</Typography.Title>
          <Button variant="link" onClick={onAddCardPack}>
            添加卡包
          </Button>
        </div>
      )
    }

    const handleValueChange = (value: string) => {
      if (isNil(value)) return

      setActiveCardPackId(Number(value))

      scrollToCardPack(Number(value))
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
        setCardPacks(
          cardPacks.map((cardPack) =>
            cardPack.id === id ? { ...cardPack, name: newName } : cardPack
          )
        )
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

    const handleDeleteCardPackClick = (id: number) => {
      if (cardPacks.length === 1) {
        toast.error('删除失败，请至少保留一个卡包')
        return
      }

      cardPackService.deleteCardPack(id)
      setCardPacks(cardPacks.filter((cardPack) => cardPack.id !== id))
    }

    const handleAddWord = (id: number) => {
      onAddWord(id)
    }

    const items = cardPacks.map((cardPack) => ({
      id: cardPack.id.toString(),
      title: (
        <div className="flex items-center gap-2 py-4" id={`cardpack-${cardPack.id}`}>
          <TextEditor
            isEdit={editingCardPackIds.includes(cardPack.id)}
            editable={editable}
            value={cardPack.name}
            titleWidth={240}
            drawerTitle="编辑卡包名称"
            onConfirm={(newName) => handleCardPackNameConfirm(cardPack.id, newName)}
            onEditStateChange={(isEdit) => handleEditCardPackId(cardPack.id, isEdit)}
          />
          {editable && (
            <div onClick={(e) => e.stopPropagation()}>
              <AlertDialog
                trigger={<Trash2 className="text-destructive ml-8 size-5 cursor-pointer" />}
                title="确定要删除该卡包吗？"
                description="卡包中的卡片与练习记录也将一并删除，请谨慎操作"
                confirmText="确认删除"
                confirmVariant="destructive"
                onConfirm={() => handleDeleteCardPackClick(cardPack.id)}
              />
            </div>
          )}
        </div>
      ),
      content: cardPack.words.length ? (
        <div className="flex flex-col gap-4 py-2 pl-4">
          {cardPack.words.map((word) => (
            <WordItem
              key={word.id}
              word={word}
              language={wordPack!.language}
              onEditSuccess={handleEditWordSuccess}
              wordPackId={wordPack!.id}
            />
          ))}
        </div>
      ) : (
        <div className="flex h-full flex-col items-center justify-center py-2">
          <Typography.Title level={5}>暂无卡片</Typography.Title>
          <Button variant="link" onClick={() => handleAddWord(cardPack.id)}>
            添加卡片
          </Button>
        </div>
      ),
    }))

    return (
      <Accordion
        items={items}
        value={activeCardPackId?.toString()}
        onValueChange={handleValueChange}
        className="-my-4"
        triggerClassName="text-xl items-center text-foreground py-0"
        contentClassName="p-0"
      />
    )
  }
)

CardpackList.displayName = 'CardpackList'

export default CardpackList
