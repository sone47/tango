import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import React from 'react'

import { Word } from '@/types'

import WordItem, { WordItemProps } from './WordItem'

const DraggableWord: React.FC<WordItemProps> = ({ word, ...props }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: word.id,
    data: {
      type: 'word',
      word,
      cardPackId: word.cardPackId,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-background border-border flex items-center gap-2 rounded-lg border p-3"
    >
      <div
        {...attributes}
        {...listeners}
        className="text-muted-foreground cursor-grab touch-none p-1 active:cursor-grabbing"
        title="拖拽排序单词"
      >
        <GripVertical className="size-4" />
      </div>
      <div className="flex-1 truncate">
        <WordItem word={word} {...props} />
      </div>
    </div>
  )
}

interface DraggableWordItemProps extends Omit<WordItemProps, 'word'> {
  words: Word[]
}

const DraggableWordItem: React.FC<DraggableWordItemProps> = ({ words, ...props }) => {
  return (
    <SortableContext items={words.map((word) => word.id)} strategy={verticalListSortingStrategy}>
      <div className="flex flex-col gap-2">
        {words.map((word) => (
          <DraggableWord key={word.id} word={word} {...props} />
        ))}
      </div>
    </SortableContext>
  )
}

export default DraggableWordItem
