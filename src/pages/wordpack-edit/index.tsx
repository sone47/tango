import { isNumber } from 'lodash'
import { Check, Edit } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import Button from '@/components/Button'
import Input from '@/components/Input'
import Page from '@/components/Page'
import Typography from '@/components/Typography'
import { wordPackService } from '@/services/wordPackService'
import { WordPack } from '@/types'

import CardpackList from './components/CardpackList'

export default function WordPackEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [wordPack, setWordPack] = useState<WordPack | null>(null)
  const [isWordPackEdit, setIsWordPackEdit] = useState(false)
  const [wordPackName, setWordPackName] = useState('')

  useEffect(() => {
    fetchWordPack()
  }, [])

  useEffect(() => {
    if (wordPack) {
      setWordPackName(wordPack.name)
    }
  }, [wordPack])

  if (!isNumber(+id!)) {
    navigate('/wordpack', { replace: true })
    return
  }

  const wordPackId = +id!

  const fetchWordPack = async () => {
    const wordPack = await wordPackService.getWordPackById(wordPackId)
    setWordPack(wordPack!)
  }

  const handleWordPackNameConfirm = () => {
    setIsWordPackEdit(false)
    if (wordPack) {
      wordPackService.updateWordPack(wordPack.id, { name: wordPackName })
    }
  }

  return (
    <Page
      title={
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
              <Button
                variant="ghost"
                className="text-primary absolute right-0 top-1/2 translate-x-full -translate-y-1/2"
                size="xs"
                icon={Check}
                onClick={handleWordPackNameConfirm}
              />
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
      }
      hasPadding={false}
    >
      <div className="px-4">
        <CardpackList wordPack={wordPack} />
      </div>
    </Page>
  )
}
