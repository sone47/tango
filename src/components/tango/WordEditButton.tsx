import { Edit, MoreHorizontal } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import Drawer, { useDrawer } from '@/components/Drawer'
import DropdownMenu from '@/components/DropdownMenu'
import VocabularyEditForm, { type VocabularyFormData } from '@/components/VocabularyEditForm'
import { vocabularyService } from '@/services/vocabularyService'
import { Word } from '@/types'

interface WordEditButtonProps {
  wordPackId: number
  word: Word
  onSuccess?: (updatedWord: Word) => void
}

const WordEditButton = ({ wordPackId, word, onSuccess }: WordEditButtonProps) => {
  const editDrawer = useDrawer()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleEditWord = () => {
    // hack: fix dropdown and drawer open simultaneously trigger failed issue
    requestAnimationFrame(() => {
      editDrawer.open()
    })
  }

  const handleFormSubmit = async (data: VocabularyFormData) => {
    setIsSubmitting(true)
    try {
      const updatedWord = await vocabularyService.updateVocabulary(word.id, {
        cardPackId: data.cardPackId,
        phonetic: data.phonetic,
        word: data.word,
        definition: data.definition,
        partOfSpeech: data.partOfSpeech,
        wordAudio: data.wordAudio,
      })

      if (updatedWord) {
        onSuccess?.(updatedWord)

        editDrawer.close()
        toast.success('词汇更新成功')
      } else {
        throw new Error('更新失败')
      }
    } catch (error) {
      toast.error('词汇更新失败')
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    editDrawer.close()
  }

  const menuItems = [
    {
      key: 'edit',
      label: '编辑',
      icon: Edit,
      onClick: handleEditWord,
    },
  ]

  return (
    <>
      <DropdownMenu items={menuItems}>
        <MoreHorizontal className="size-4 cursor-pointer" />
      </DropdownMenu>

      <Drawer
        open={editDrawer.isOpen}
        onOpenChange={editDrawer.setIsOpen}
        title="编辑词汇"
        className="!max-h-[90vh]"
        contentClassName="pb-6"
        showCloseButton={false}
      >
        {word && (
          <VocabularyEditForm
            wordPackId={wordPackId}
            vocabulary={word}
            isCreate={false}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelEdit}
            loading={isSubmitting}
          />
        )}
      </Drawer>
    </>
  )
}

export default WordEditButton
