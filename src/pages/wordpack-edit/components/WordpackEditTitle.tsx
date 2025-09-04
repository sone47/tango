import { useState } from 'react'
import { toast } from 'sonner'

import { wordPackService } from '@/services/wordPackService'
import { WordPack } from '@/types'

import TextEditor from './TextEditor'

const WordpackEditTitle = ({ wordPack }: { wordPack?: WordPack }) => {
  const [isWordPackEdit, setIsWordPackEdit] = useState(false)

  const handleWordPackNameConfirm = async (newName: string) => {
    if (!wordPack) return

    try {
      const wordPacks = await wordPackService.getWordPacksBy({
        where: [{ field: 'name', operator: 'eq', value: newName }],
      })
      if (wordPacks.length > 0 && wordPacks[0].id !== wordPack.id) {
        toast.error('词包名称已存在')
        return
      }

      await wordPackService.updateWordPack(wordPack.id, { name: newName })
      wordPack.name = newName

      setIsWordPackEdit(false)
    } catch {
      toast.error('更新词包名称失败')
    }
  }

  return (
    <TextEditor
      isEdit={isWordPackEdit}
      value={wordPack?.name ?? ''}
      onConfirm={handleWordPackNameConfirm}
      onEditStateChange={setIsWordPackEdit}
    />
  )
}

export default WordpackEditTitle
