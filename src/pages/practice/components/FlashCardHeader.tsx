// import { Edit, MoreHorizontal } from 'lucide-react'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Drawer, { useDrawer } from '@/components/Drawer'
// import DropdownMenu from '@/components/DropdownMenu'
import VocabularyEditForm, { type VocabularyFormData } from '@/components/VocabularyEditForm'
import { cn } from '@/lib/utils'
import { vocabularyService } from '@/services/vocabularyService'
import { usePracticeStore } from '@/stores/practiceStore'
// import type { Word } from '@/types'

interface FlashCardHeaderProps {
  currentIndex: number
  totalCount: number
  variant?: 'light' | 'dark'
  className?: string
}

const FlashCardHeader = ({
  currentIndex,
  totalCount,
  variant = 'light',
  className = '',
}: FlashCardHeaderProps) => {
  const baseClasses = 'flex items-center justify-between'
  const variantClasses = {
    light: 'bg-gray-100/80 backdrop-blur-sm text-gray-600',
    dark: 'bg-white/80 backdrop-blur-sm text-gray-600',
  }

  const editDrawer = useDrawer()
  const { updateState, shuffledWords, currentWordIndex } = usePracticeStore()

  const [isSubmitting, setIsSubmitting] = useState(false)

  const word = shuffledWords[currentWordIndex]

  const handleEditWord = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (!word) {
      console.warn('没有可编辑的词汇数据')
      return
    }
    editDrawer.open()
  }

  const handleFormSubmit = async (data: VocabularyFormData) => {
    setIsSubmitting(true)
    try {
      const updatedWord = await vocabularyService.updateVocabulary(word.id, {
        cardPackId: data.cardPackId,
        phonetic: data.phonetic,
        word: data.word,
        definition: data.definition,
        example: data.example,
        wordAudio: data.wordAudio,
        exampleAudio: data.exampleAudio,
      })

      if (updatedWord) {
        updateState({
          shuffledWords: shuffledWords.map((w) => (w.id === updatedWord.id ? updatedWord : w)),
        })

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

  // const menuItems = [
  //   {
  //     key: 'edit',
  //     label: '编辑',
  //     icon: Edit,
  //     onClick: handleEditWord,
  //     disabled: !word,
  //   },
  // ]

  return (
    <>
      <div className={cn(baseClasses, className)}>
        <div className={`${variantClasses[variant]} px-3 py-1 rounded-full text-sm font-medium`}>
          {currentIndex + 1}/{totalCount}
        </div>
        {/* <DropdownMenu items={menuItems}>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenu> */}
        <Button variant="ghost" size="icon" onClick={handleEditWord}>
          <Edit className="size-4" />
        </Button>
      </div>

      <Drawer
        open={editDrawer.isOpen}
        onOpenChange={editDrawer.setIsOpen}
        title="编辑词汇"
        className="max-h-[90vh]"
        showCloseButton={false}
      >
        {word && (
          <VocabularyEditForm
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

export default FlashCardHeader
