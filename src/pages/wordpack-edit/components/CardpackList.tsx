import {
  closestCorners,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDebounce } from '@uidotdev/usehooks'
import { isNil, last } from 'lodash'
import { FolderSearch } from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Loading from '@/components/Loading'
import Typography from '@/components/Typography'
import { cardPackService } from '@/services/cardPackService'
import { vocabularyService } from '@/services/vocabularyService'
import { CardPack, Word, WordPackEntity } from '@/types'

import CardpackItem from './CardpackItem'

interface CardpackListProps {
  wordPack?: WordPackEntity | null
  editable: boolean
  onAddCardPack: () => void
  onAddWord: (cardPackId: number) => void
}

export interface CardpackListRef {
  scrollToCardPack: (cardPackId: number) => void
  scrollToCardPackLastWord: (cardPackId: number) => void
  appendCardPack: (cardPack: CardPack) => void
  handleWordAddSuccess: (word: Word) => void
}

const CardpackList = forwardRef<CardpackListRef, CardpackListProps>(
  ({ wordPack, editable, onAddCardPack, onAddWord }, ref) => {
    const [cardPacks, setCardPacks] = useState<CardPack[]>([])
    const [isLoading, setIsLoading] = useState(false)
    const [expandedCardPackIds, setExpandedCardPackIds] = useState<Set<number>>(new Set())
    const [scrollY, setScrollY] = useState(0)

    const debouncedScrollY = useDebounce(scrollY, 100)

    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 3, // 降低激活距离，让拖拽更敏感
        },
      })
    )

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
        setExpandedCardPackIds(new Set([cardPacks[0].id]))
      }
    }, [cardPacks])

    const scrollToCardPack = (cardPackId: number) => {
      const cardpack = document.getElementById(`cardpack-${cardPackId}`)
      if (cardpack) {
        cardpack.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    const scrollToCardPackLastWord = (cardPackId: number) => {
      const cardpackWords = document.getElementById(`cardpack-${cardPackId}-words`)
      if (cardpackWords) {
        if (!expandedCardPackIds.has(cardPackId)) {
          setExpandedCardPackIds((prev) => new Set([...prev, cardPackId]))
        }

        requestAnimationFrame(() => {
          const lastWord = last(cardpackWords.childNodes[0].childNodes) as HTMLElement
          lastWord.scrollIntoView({
            block: 'center',
            behavior: 'smooth',
          })
        })
      }
    }

    const appendCardPack = (cardPack: CardPack) => {
      setCardPacks([...cardPacks, cardPack])

      setExpandedCardPackIds((prev) => new Set([...prev, cardPack.id]))
    }

    const handleWordAddSuccess = (word: Word) => {
      setCardPacks(
        cardPacks.map((cardPack) =>
          cardPack.id === word.cardPackId
            ? { ...cardPack, words: [...cardPack.words, word] }
            : cardPack
        )
      )
    }

    useImperativeHandle(ref, () => ({
      scrollToCardPack,
      appendCardPack,
      scrollToCardPackLastWord,
      handleWordAddSuccess,
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

    const handleToggleCardPack = (cardPackId: number) => {
      const newExpanded = new Set(expandedCardPackIds)
      if (newExpanded.has(cardPackId)) {
        newExpanded.delete(cardPackId)
      } else {
        newExpanded.add(cardPackId)
      }
      setExpandedCardPackIds(newExpanded)

      setTimeout(() => scrollToCardPack(cardPackId), 100)
    }

    const handleEditWordSuccess = (updatedWord: Word, oldWord: Word) => {
      const cardPack = cardPacks.find((cardPack) => cardPack.id === updatedWord.cardPackId)

      if (updatedWord.cardPackId === oldWord.cardPackId) {
        if (cardPack) {
          cardPack.words = cardPack.words.map((word) =>
            word.id === updatedWord.id ? updatedWord : word
          )
        }
      } else {
        const removedCardPack = cardPacks.find((cardPack) => cardPack.id === oldWord.cardPackId)
        if (removedCardPack) {
          removedCardPack.words = removedCardPack.words.filter((word) => word.id !== oldWord.id)
        }
        if (cardPack) {
          cardPack.words = [...cardPack.words, updatedWord]
        }
      }

      setCardPacks([...cardPacks])
    }

    const handleDeleteWordSuccess = (cardPackId: number, wordId: number) => {
      setCardPacks(
        cardPacks.map((cardPack) =>
          cardPack.id === cardPackId
            ? { ...cardPack, words: cardPack.words.filter((word) => word.id !== wordId) }
            : cardPack
        )
      )
    }

    const handleCardPackNameEdit = async (id: number, newName: string) => {
      try {
        await cardPackService.updateCardPack(id, { name: newName })
        setCardPacks(
          cardPacks.map((cardPack) =>
            cardPack.id === id ? { ...cardPack, name: newName } : cardPack
          )
        )
      } catch {
        toast.error('更新卡包名称失败')
      }
    }

    const handleDeleteCardPack = (id: number) => {
      if (cardPacks.length === 1) {
        toast.error('删除失败，请至少保留一个卡包')
        return
      }

      cardPackService.deleteCardPack(id)
      setCardPacks(cardPacks.filter((cardPack) => cardPack.id !== id))

      const newExpanded = new Set(expandedCardPackIds)
      newExpanded.delete(id)
      setExpandedCardPackIds(newExpanded)
    }

    const handleDragEnd = async (event: DragEndEvent) => {
      const { active, over } = event

      if (!over) return

      const activeData = active.data.current
      const overData = over.data.current

      if (activeData?.type === 'cardpack' && overData?.type === 'cardpack') {
        const activeCardPackId = activeData.cardPack.id
        const overCardPackId = overData.cardPack.id

        if (activeCardPackId !== overCardPackId) {
          await handleCardPackReorder(activeCardPackId, overCardPackId)
        }
      } else if (activeData?.type === 'word' && overData?.type === 'word') {
        const activeWordId = Number(active.id)
        const overWordId = Number(over.id)
        const cardPackId = activeData.cardPackId

        if (activeWordId !== overWordId) {
          await handleWordReorder(cardPackId, activeWordId, overWordId)
        }
      }
    }

    const handleCardPackReorder = async (activeId: number, overId: number) => {
      const oldIndex = cardPacks.findIndex((cp) => cp.id === activeId)
      const newIndex = cardPacks.findIndex((cp) => cp.id === overId)

      const reorderedCardPacks = arrayMove(cardPacks, oldIndex, newIndex)
      setCardPacks(reorderedCardPacks)

      try {
        await cardPackService.updateCardPacksOrder(
          wordPack!.id,
          reorderedCardPacks.map((cp) => cp.id)
        )
      } catch (error) {
        console.error('修改卡包顺序失败:', error)
        toast.error('修改卡包顺序失败')
        setCardPacks(cardPacks)
      }
    }

    const handleWordReorder = async (
      cardPackId: number,
      activeWordId: number,
      overWordId: number
    ) => {
      const cardPack = cardPacks.find((cp) => cp.id === cardPackId)
      if (!cardPack) return

      const oldIndex = cardPack.words.findIndex((w) => w.id === activeWordId)
      const newIndex = cardPack.words.findIndex((w) => w.id === overWordId)

      if (oldIndex === -1 || newIndex === -1) return

      cardPack.words = arrayMove(cardPack.words, oldIndex, newIndex)
      setCardPacks([...cardPacks])

      try {
        await vocabularyService.updateVocabulariesOrder(cardPack.words.map((w) => w.id))
      } catch (error) {
        console.error('修改卡片顺序失败:', error)
        toast.error('修改卡片顺序失败')

        const originalCardPack = cardPacks.find((cp) => cp.id === cardPackId)
        if (originalCardPack) {
          originalCardPack.words = arrayMove(cardPack.words, newIndex, oldIndex)
          setCardPacks([...cardPacks])
        }
      }
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrollY((e.target as HTMLDivElement).scrollTop)
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext
          items={cardPacks.map((cp) => `cardpack-${cp.id}`)}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex-1 space-y-4 overflow-y-auto" onScroll={handleScroll}>
            {cardPacks.map((cardPack) => (
              <CardpackItem
                key={cardPack.id}
                parentScrollY={debouncedScrollY}
                cardPack={cardPack}
                isExpanded={expandedCardPackIds.has(cardPack.id)}
                editable={editable}
                language={wordPack!.language}
                wordPackId={wordPack!.id}
                onToggle={() => handleToggleCardPack(cardPack.id)}
                onEditName={(newName) => handleCardPackNameEdit(cardPack.id, newName)}
                onDelete={() => handleDeleteCardPack(cardPack.id)}
                onAddWord={() => onAddWord(cardPack.id)}
                onEditWordSuccess={handleEditWordSuccess}
                onDeleteWordSuccess={handleDeleteWordSuccess}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    )
  }
)

CardpackList.displayName = 'CardpackList'

export default CardpackList
