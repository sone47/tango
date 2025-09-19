import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { AlignJustify, ChevronDown, ChevronRight, PlusSquare, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'

import AlertDialog from '@/components/AlertDialog'
import Button from '@/components/Button'
import Typography from '@/components/Typography'
import { LanguageEnum } from '@/constants/language'
import { cn } from '@/lib/utils'
import { CardPack, Word } from '@/types'

import DraggableWordItem from './DraggableWordItem'
import TextEditor from './TextEditor'

interface CardpackItemProps {
  parentScrollY: number
  cardPack: CardPack
  isExpanded: boolean
  editable: boolean
  language: LanguageEnum
  wordPackId: number
  index: number
  totalExpanded: number
  onToggle: () => void
  onEditName: (newName: string) => void
  onDelete: () => void
  onAddWord: () => void
  onEditWordSuccess: (updatedWord: Word) => void
  onDeleteWordSuccess: (cardPackId: number, wordId: number) => void
  onWordReorder: (cardPackId: number, wordId: number, newIndex: number) => void
}

const CardpackItem: React.FC<CardpackItemProps> = ({
  parentScrollY,
  cardPack,
  isExpanded,
  editable,
  language,
  wordPackId,
  onToggle,
  onEditName,
  onDelete,
  onAddWord,
  onEditWordSuccess,
  onDeleteWordSuccess,
}) => {
  const [isEditingName, setIsEditingName] = useState(false)
  const [headerOffsetTop, setHeaderOffsetTop] = useState(0)
  const [headerOffsetHeight, setHeaderOffsetHeight] = useState(0)
  const nodeRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headerRef.current) return
    setHeaderOffsetHeight(headerRef.current.offsetHeight)
  }, [headerRef])

  const { ref: contentInViewRef, inView: isContentInView } = useInView({
    threshold: 0,
  })

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `cardpack-${cardPack.id}`,
    data: {
      type: 'cardpack',
      cardPack,
    },
    disabled: !editable,
  })

  useEffect(() => {
    if (!isContentInView || !nodeRef.current) return

    const offsetTop = nodeRef.current.offsetTop - nodeRef.current.parentElement!.offsetTop
    setHeaderOffsetTop(
      Math.min(
        Math.max(parentScrollY - offsetTop, 0),
        nodeRef.current.offsetHeight - headerOffsetHeight
      )
    )
  }, [isContentInView, parentScrollY, headerOffsetHeight])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const handleNameConfirm = (newName: string) => {
    onEditName(newName)
    setIsEditingName(false)
  }

  const handleEditStateChange = (isEdit: boolean) => {
    setIsEditingName(isEdit)
  }

  const handleDeleteWordSuccess = (wordId: number) => {
    onDeleteWordSuccess(cardPack.id, wordId)
  }

  const headerContent = (
    <div className="flex items-center gap-2 py-4">
      <Button variant="ghost" size="sm" onClick={onToggle} className="h-auto !p-0">
        {isExpanded ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
      </Button>
      <TextEditor
        isEdit={isEditingName}
        editable={editable}
        value={cardPack.name}
        titleWidth={240}
        iconSize={4}
        drawerTitle="编辑卡包名称"
        onConfirm={handleNameConfirm}
        onEditStateChange={handleEditStateChange}
      />
      {editable && (
        <div onClick={(e) => e.stopPropagation()} className="ml-6 flex items-center gap-2">
          <Button variant="ghost" size="sm" className="h-auto !p-0" onClick={onAddWord}>
            <PlusSquare className="text-primary size-4" />
          </Button>
          <AlertDialog
            trigger={<Trash2 className="text-destructive size-4 cursor-pointer" />}
            title="确定要删除该卡包吗？"
            description="卡包中的卡片与练习记录也将一并删除，请谨慎操作"
            confirmText="确认删除"
            confirmVariant="destructive"
            onConfirm={onDelete}
          />
        </div>
      )}
      {editable && !isExpanded && (
        <div
          {...attributes}
          {...listeners}
          className="ml-auto cursor-grab touch-none rounded active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          title="拖拽对卡包进行排序"
        >
          <AlignJustify className="text-muted-foreground size-5" />
        </div>
      )}
    </div>
  )

  return (
    <div
      ref={(el) => {
        setNodeRef(el)
        nodeRef.current = el
      }}
      style={style}
      className="bg-background overflow-x-hidden rounded-lg border"
      id={`cardpack-${cardPack.id}`}
    >
      <div
        ref={headerRef}
        className={cn('relative bg-muted border-border px-4 text-xl font-medium')}
        style={
          isContentInView && headerOffsetTop
            ? {
                transform: `translateY(${headerOffsetTop - 2}px)`,
              }
            : {}
        }
      >
        {headerContent}
      </div>
      {isExpanded && (
        <div ref={contentInViewRef} className="p-4">
          {cardPack.words.length > 0 ? (
            <div className="flex flex-col gap-4" id={`cardpack-${cardPack.id}-words`}>
              <DraggableWordItem
                words={cardPack.words}
                editable={editable}
                language={language}
                wordPackId={wordPackId}
                onEditSuccess={onEditWordSuccess}
                onDeleteSuccess={(wordId) => handleDeleteWordSuccess(wordId)}
              />
            </div>
          ) : (
            <div className="flex h-32 flex-col items-center justify-center">
              <Typography.Title level={5}>暂无卡片</Typography.Title>
              <Button variant="link" onClick={onAddWord}>
                添加卡片
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CardpackItem
