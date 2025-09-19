import { Edit, MoreHorizontal, Trash } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { AlertDialog, useAlertDialog } from '@/components/AlertDialog'
import Drawer, { useDrawer } from '@/components/Drawer'
import DropdownMenu, { type DropdownOption } from '@/components/DropdownMenu'
import VocabularyEditForm, { type VocabularyFormData } from '@/components/VocabularyEditForm'
import { vocabularyService } from '@/services/vocabularyService'
import { Word } from '@/types'

interface WordEditButtonProps {
  wordPackId: number
  word: Word
  onEditSuccess?: (updatedWord: Word, oldWord: Word) => void
  onDeleteSuccess?: (wordId: number) => void
}

const WordEditButton = ({
  wordPackId,
  word,
  onEditSuccess,
  onDeleteSuccess,
}: WordEditButtonProps) => {
  const editDrawer = useDrawer()
  const deleteDialog = useAlertDialog()

  const [isEditSubmitting, setIsEditSubmitting] = useState(false)
  const [isDeleteSubmitting, setIsDeleteSubmitting] = useState(false)

  const handleEditWord = () => {
    // hack: fix dropdown and drawer open simultaneously trigger failed issue
    requestAnimationFrame(() => {
      editDrawer.open()
    })
  }

  const handleDeleteWord = () => {
    requestAnimationFrame(() => {
      deleteDialog.show()
    })
  }

  const handleFormSubmit = async (data: VocabularyFormData) => {
    setIsEditSubmitting(true)
    try {
      let updatedWord

      if (data.cardPackId !== word.cardPackId) {
        updatedWord = await vocabularyService.moveVocabularyToCardPack(word.id, data.cardPackId)
      }
      updatedWord = await vocabularyService.updateVocabulary(word.id, {
        cardPackId: data.cardPackId,
        phonetic: data.phonetic,
        word: data.word,
        definition: data.definition,
        partOfSpeech: data.partOfSpeech,
        wordAudio: data.wordAudio,
      })

      if (updatedWord) {
        onEditSuccess?.(updatedWord, word)

        editDrawer.close()
        toast.success('卡片更新成功')
      } else {
        throw new Error('更新失败')
      }
    } catch (error) {
      toast.error('卡片更新失败')
      console.error(error)
    } finally {
      setIsEditSubmitting(false)
    }
  }

  const handleDeleteWordConfirm = async () => {
    setIsDeleteSubmitting(true)
    try {
      await vocabularyService.deleteVocabulary(word.id)

      onDeleteSuccess?.(word.id)
      deleteDialog.hide()
      toast.success('卡片删除成功')
    } catch (error) {
      toast.error('卡片删除失败')
      console.error(error)
    } finally {
      setIsDeleteSubmitting(false)
    }
  }

  const handleCancelEdit = () => {
    editDrawer.close()
  }

  const menuItems: DropdownOption[] = [
    {
      key: 'edit',
      label: '编辑',
      icon: Edit,
      onClick: handleEditWord,
    },
    {
      key: 'delete',
      label: '删除',
      icon: Trash,
      onClick: handleDeleteWord,
      variant: 'destructive',
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
        title="编辑卡片"
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
            loading={isEditSubmitting}
          />
        )}
      </Drawer>

      <AlertDialog
        open={deleteDialog.isOpen}
        onOpenChange={deleteDialog.setIsOpen}
        title="删除卡片"
        description="删除卡片操作会导致词汇及其练习记录一并删除，不可恢复，请谨慎操作"
        confirmText="删除"
        confirmVariant="destructive"
        onConfirm={handleDeleteWordConfirm}
        loading={isDeleteSubmitting}
      />
    </>
  )
}

export default WordEditButton
