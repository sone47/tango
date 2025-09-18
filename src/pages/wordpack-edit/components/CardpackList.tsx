import {
  closestCorners,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useDebounce } from '@uidotdev/usehooks'
import { isNil } from 'lodash'
import { FolderSearch } from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Loading from '@/components/Loading'
import Typography from '@/components/Typography'
import { cardPackService } from '@/services/cardPackService'
import { CardPack, Word, WordPackEntity } from '@/types'

import CardpackItem from './CardpackItem'
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
    const [expandedCardPackIds, setExpandedCardPackIds] = useState<Set<number>>(new Set())
    const [activeItem, setActiveItem] = useState<
      | {
          type: 'cardpack'
          data: CardPack
        }
      | {
          type: 'word'
          data: Word
        }
      | null
    >(null)
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

    const appendCardPack = (cardPack: CardPack) => {
      setCardPacks([...cardPacks, cardPack])
      // 自动展开新添加的卡包
      setExpandedCardPackIds((prev) => new Set([...prev, cardPack.id]))
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

    const handleEditWordSuccess = (updatedWord: Word) => {
      const cardPack = cardPacks.find((cardPack) => cardPack.id === updatedWord.cardPackId)
      if (cardPack) {
        cardPack.words = cardPack.words.map((word) =>
          word.id === updatedWord.id ? updatedWord : word
        )
        setCardPacks([...cardPacks])
      }
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

    // 处理拖拽开始
    const handleDragStart = (event: DragStartEvent) => {
      const { active } = event
      const activeData = active.data.current

      if (activeData?.type === 'cardpack') {
        setActiveItem({ type: 'cardpack', data: activeData.cardPack })
      } else if (activeData?.type === 'word') {
        setActiveItem({ type: 'word', data: activeData.word })
      }
    }

    // 处理拖拽事件
    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event

      // 清除拖拽状态
      setActiveItem(null)

      if (!over) return

      const activeData = active.data.current
      const overData = over.data.current

      // 卡包排序
      if (activeData?.type === 'cardpack' && overData?.type === 'cardpack') {
        const activeCardPackId = activeData.cardPack.id
        const overCardPackId = overData.cardPack.id

        if (activeCardPackId !== overCardPackId) {
          const oldIndex = cardPacks.findIndex((cp) => cp.id === activeCardPackId)
          const newIndex = cardPacks.findIndex((cp) => cp.id === overCardPackId)

          const reorderedCardPacks = arrayMove(cardPacks, oldIndex, newIndex)
          setCardPacks(reorderedCardPacks)

          // TODO: 调用 API 更新卡包顺序
          // await cardPackService.updateCardPackOrder(wordPack!.id, reorderedCardPacks.map(cp => cp.id))
        }
      }

      // 单词排序（同一卡包内）
      else if (activeData?.type === 'word' && overData?.type === 'word') {
        const activeWordId = Number(active.id)
        const overWordId = Number(over.id)
        const activeCardPackId = activeData.cardPackId
        const overCardPackId = overData.cardPackId

        // 同一卡包内排序
        if (activeCardPackId === overCardPackId && activeWordId !== overWordId) {
          handleWordReorder(activeCardPackId, activeWordId, overWordId)
        }
        // 跨卡包移动
        else if (activeCardPackId !== overCardPackId) {
          const targetCardPack = cardPacks.find((cp) => cp.id === overCardPackId)
          if (targetCardPack) {
            const newIndex = targetCardPack.words.findIndex((w) => w.id === overWordId)
            handleWordMove(activeWordId, activeCardPackId, overCardPackId, newIndex)
          }
        }
      }

      // 单词移动到卡包（跨卡包移动）
      else if (activeData?.type === 'word' && overData?.type === 'cardpack') {
        const activeWordId = Number(active.id)
        const activeCardPackId = activeData.cardPackId
        const targetCardPackId = overData.cardPack.id

        if (activeCardPackId !== targetCardPackId) {
          handleWordMove(activeWordId, activeCardPackId, targetCardPackId, 0)
        }
      }
    }

    const handleWordMove = (
      wordId: number,
      fromCardPackId: number,
      toCardPackId: number,
      newIndex: number
    ) => {
      // 跨卡包移动单词
      const sourceCardPack = cardPacks.find((cp) => cp.id === fromCardPackId)
      const targetCardPack = cardPacks.find((cp) => cp.id === toCardPackId)

      if (!sourceCardPack || !targetCardPack) return

      const wordToMove = sourceCardPack.words.find((w) => w.id === wordId)
      if (!wordToMove) return

      // 从源卡包移除
      sourceCardPack.words = sourceCardPack.words.filter((w) => w.id !== wordId)

      // 添加到目标卡包
      const updatedWord = { ...wordToMove, cardPackId: toCardPackId }
      targetCardPack.words.splice(newIndex, 0, updatedWord)

      setCardPacks([...cardPacks])

      // TODO: 调用 API 更新单词的卡包归属
      // await vocabularyService.updateWord(wordId, { cardPackId: toCardPackId })
    }

    const handleWordReorder = (cardPackId: number, activeWordId: number, overWordId: number) => {
      // 同一卡包内单词重排序
      const cardPack = cardPacks.find((cp) => cp.id === cardPackId)
      if (!cardPack) return

      const oldIndex = cardPack.words.findIndex((w) => w.id === activeWordId)
      const newIndex = cardPack.words.findIndex((w) => w.id === overWordId)

      if (oldIndex === -1 || newIndex === -1) return

      cardPack.words = arrayMove(cardPack.words, oldIndex, newIndex)
      setCardPacks([...cardPacks])

      // TODO: 调用 API 更新单词顺序
      // await cardPackService.updateWordOrder(cardPackId, cardPack.words.map(w => w.id))
    }

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      setScrollY((e.target as HTMLDivElement).scrollTop)
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={[
            ...cardPacks.map((cp) => `cardpack-${cp.id}`),
            ...cardPacks.flatMap((cp) => cp.words.map((w) => w.id)),
          ]}
          strategy={verticalListSortingStrategy}
        >
          <div className="flex-1 space-y-4 overflow-y-auto" onScroll={handleScroll}>
            {cardPacks.map((cardPack, index) => {
              const expandedCardPacksBeforeThis = cardPacks
                .slice(0, index)
                .filter((cp) => expandedCardPackIds.has(cp.id)).length

              return (
                <CardpackItem
                  key={cardPack.id}
                  parentScrollY={debouncedScrollY}
                  cardPack={cardPack}
                  isExpanded={expandedCardPackIds.has(cardPack.id)}
                  editable={editable}
                  language={wordPack!.language}
                  wordPackId={wordPack!.id}
                  index={expandedCardPacksBeforeThis}
                  totalExpanded={expandedCardPackIds.size}
                  onToggle={() => handleToggleCardPack(cardPack.id)}
                  onEditName={(newName) => handleCardPackNameEdit(cardPack.id, newName)}
                  onDelete={() => handleDeleteCardPack(cardPack.id)}
                  onAddWord={() => onAddWord(cardPack.id)}
                  onEditWordSuccess={handleEditWordSuccess}
                  onWordReorder={handleWordReorder}
                />
              )
            })}
          </div>
        </SortableContext>

        <DragOverlay>
          {activeItem?.type === 'cardpack' && (
            <div className="bg-background border-border rounded-lg border p-4 opacity-90 shadow-lg">
              <div className="font-medium">{activeItem.data.name}</div>
            </div>
          )}
          {activeItem?.type === 'word' && (
            <div className="bg-background border-border rounded-lg border p-3 opacity-90 shadow-lg">
              <WordItem
                word={activeItem.data}
                language={wordPack!.language}
                wordPackId={wordPack!.id}
                onEditSuccess={() => {}}
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    )
  }
)

CardpackList.displayName = 'CardpackList'

export default CardpackList
