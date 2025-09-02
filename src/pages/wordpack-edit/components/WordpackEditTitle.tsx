import { Check, Edit, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Input from '@/components/Input'
import Typography from '@/components/Typography'
import { wordPackService } from '@/services/wordPackService'
import { WordPack } from '@/types'

const WordpackEditTitle = ({ wordPack }: { wordPack?: WordPack }) => {
  const [isWordPackEdit, setIsWordPackEdit] = useState(false)
  const [wordPackName, setWordPackName] = useState('')

  useEffect(() => {
    if (wordPack) {
      setWordPackName(wordPack.name)
    }
  }, [wordPack])

  const handleWordPackNameConfirm = async () => {
    if (wordPack) {
      try {
        const wordPacks = await wordPackService.getWordPacksBy({
          where: [{ field: 'name', operator: 'eq', value: wordPackName }],
        })
        if (wordPacks.length > 0 && wordPacks[0].id !== wordPack.id) {
          toast.error('词包名称已存在')
          return
        }

        await wordPackService.updateWordPack(wordPack.id, { name: wordPackName })
        setIsWordPackEdit(false)
      } catch {
        toast.error('更新词包名称失败')
      }
    }
  }

  const handleExitEdit = () => {
    setIsWordPackEdit(false)
    setWordPackName(wordPack?.name || '')
  }

  return (
    <div className="flex items-center">
      {isWordPackEdit ? (
        <div className="relative flex">
          <Input
            className="w-[230px]"
            size="sm"
            autoFocus
            value={wordPackName}
            onChange={(e) => setWordPackName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleWordPackNameConfirm()
              }
            }}
          />
          <div className="flex items-center gap-2 absolute right-0 top-1/2 translate-x-full -translate-y-1/2 pl-2">
            <Button
              variant="ghost"
              className="text-primary !p-0"
              size="xs"
              icon={Check}
              onClick={handleWordPackNameConfirm}
            />
            <Button
              variant="ghost"
              className="text-secondary-foreground !p-0"
              size="xs"
              icon={X}
              onClick={handleExitEdit}
            />
          </div>
        </div>
      ) : (
        <div className="relative flex">
          <Typography.Title level={5} className="max-w-[230px] truncate">
            {wordPackName}
          </Typography.Title>
          <Button
            variant="ghost"
            className="text-primary absolute right-0 top-1/2 translate-x-full -translate-y-1/2"
            size="xs"
            icon={Edit}
            onClick={() => setIsWordPackEdit(true)}
          />
        </div>
      )}
    </div>
  )
}

export default WordpackEditTitle
