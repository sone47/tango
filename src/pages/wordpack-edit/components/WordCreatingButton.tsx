import { Plus } from 'lucide-react'
import { forwardRef, useImperativeHandle, useRef, useState } from 'react'
import Draggable from 'react-draggable'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Dialog, { useDialog } from '@/components/Dialog'
import VocabularyEditForm, { type VocabularyFormData } from '@/components/VocabularyEditForm'
import { vocabularyService } from '@/services/vocabularyService'
import { WordPack } from '@/types'

export interface WordCreatingButtonRef {
  handleClick: (cardPackId?: number) => void
}

interface WordCreatingButtonProps {
  wordPack: WordPack
  onWordCreated?: () => void
}

const WordCreatingButton = forwardRef<WordCreatingButtonRef, WordCreatingButtonProps>(
  ({ wordPack, onWordCreated }: WordCreatingButtonProps, ref) => {
    const dialog = useDialog()

    const [isLoading, setIsLoading] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    const [cardPackId, setCardPackId] = useState<number>()

    const nodeRef = useRef<HTMLDivElement>({} as any)
    useImperativeHandle(ref, () => ({
      handleClick,
    }))

    const handleDragStart = () => {
      setIsDragging(true)
    }

    const handleDragStop = () => {
      setIsDragging(false)
    }

    const handleClick = (cardPackId?: number) => {
      dialog.open()
      setCardPackId(cardPackId)
    }

    const handleSubmit = async (data: VocabularyFormData) => {
      setIsLoading(true)
      try {
        const result = await vocabularyService.createVocabulary({
          cardPackId: data.cardPackId,
          word: data.word,
          phonetic: data.phonetic || '',
          definition: data.definition,
          partOfSpeech: data.partOfSpeech,
          wordAudio: data.wordAudio || '',
        })

        if (result) {
          toast.success('单词添加成功')
          dialog.close()
          onWordCreated?.()
        } else {
          toast.error('添加单词失败')
        }
      } catch (error) {
        console.error('添加单词失败:', error)
        toast.error('添加单词失败')
      } finally {
        setIsLoading(false)
      }
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
              onClick={() => handleClick()}
              className={`
              transition-scale size-full cursor-move backdrop-blur-md
              duration-200
              ${isDragging ? 'scale-110 cursor-grabbing' : 'cursor-grab hover:scale-105'}
            `}
            />
          </div>
        </Draggable>

        <Dialog
          open={dialog.isOpen}
          onOpenChange={dialog.setIsOpen}
          title="添加新单词"
          maxWidth="md"
          openAutoFocus={false}
          closeOnMaskClick={false}
        >
          <VocabularyEditForm
            isCreate
            vocabulary={cardPackId ? { cardPackId } : undefined}
            wordPackId={wordPack.id}
            onSubmit={handleSubmit}
            onCancel={() => dialog.close()}
            loading={isLoading}
          />
        </Dialog>
      </>
    )
  }
)

export default WordCreatingButton
