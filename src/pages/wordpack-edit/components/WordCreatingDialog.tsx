import { isNil } from 'lodash'
import { forwardRef, useImperativeHandle, useState } from 'react'
import { toast } from 'sonner'

import Dialog, { useDialog } from '@/components/Dialog'
import VocabularyEditForm, { VocabularyFormData } from '@/components/VocabularyEditForm'
import { vocabularyService } from '@/services/vocabularyService'
import { Word } from '@/types'

interface WordCreatingDialogProps {
  cardPackId?: number
  wordPackId?: number
  onWordCreated?: (word: Word) => void
}

export interface WordCreatingDialogRef {
  open: () => void
}

const WordCreatingDialog = forwardRef<WordCreatingDialogRef, WordCreatingDialogProps>(
  ({ cardPackId, wordPackId, onWordCreated }, ref) => {
    const dialog = useDialog()
    const [isLoading, setIsLoading] = useState(false)

    useImperativeHandle(ref, () => ({
      open: dialog.open,
    }))

    if (isNil(wordPackId)) {
      return null
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

          onWordCreated?.(result)
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
          vocabulary={{ cardPackId }}
          wordPackId={wordPackId}
          onSubmit={handleSubmit}
          onCancel={() => dialog.close()}
          loading={isLoading}
        />
      </Dialog>
    )
  }
)

WordCreatingDialog.displayName = 'WordCreatingDialog'

export default WordCreatingDialog
