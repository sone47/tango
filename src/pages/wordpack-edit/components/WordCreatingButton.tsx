import { Plus } from 'lucide-react'
import { useRef, useState } from 'react'
import Draggable from 'react-draggable'

import Button from '@/components/Button'

interface WordCreatingButtonProps {
  onClick: () => void
}

const WordCreatingButton = ({ onClick }: WordCreatingButtonProps) => {
  const [isDragging, setIsDragging] = useState(false)

  const nodeRef = useRef<HTMLDivElement>({} as any)

  const handleDragStart = () => {
    setIsDragging(true)
  }

  const handleDragStop = () => {
    setIsDragging(false)
  }

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        onStart={handleDragStart}
        onStop={handleDragStop}
        allowMobileScroll
        bounds="body"
      >
        <div className="absolute right-6 bottom-6 z-50 h-14 w-14" ref={nodeRef}>
          <Button
            size="lg"
            variant="primary"
            round
            icon={Plus}
            onClick={onClick}
            className={`
              transition-scale size-full cursor-move backdrop-blur-md
              duration-200
              ${isDragging ? 'scale-110 cursor-grabbing' : 'cursor-grab hover:scale-105'}
            `}
          />
        </div>
      </Draggable>
    </>
  )
}

export default WordCreatingButton
