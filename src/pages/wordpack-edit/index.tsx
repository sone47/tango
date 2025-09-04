import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import Card from '@/components/Card'
import Page from '@/components/Page'
import { Tabs } from '@/components/Tabs'
import { wordPackService } from '@/services/wordPackService'
import { WordPack } from '@/types'

import CardpackList from './components/CardpackList'
import WordList from './components/WordList'
import WordpackEditTitle from './components/WordpackEditTitle'

export default function WordPackEditPage() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [wordPack, setWordPack] = useState<WordPack>()
  const wordPackId = useMemo(() => +id!, [id])

  useEffect(() => {
    if (isNaN(wordPackId)) {
      navigate('/wordpack', { replace: true })
      return
    }

    fetchWordPack()
  }, [wordPackId])

  const fetchWordPack = async () => {
    const wordPack = await wordPackService.getWordPackById(wordPackId)
    setWordPack(wordPack!)
  }

  return (
    <Page title={<WordpackEditTitle wordPack={wordPack} />}>
      <Tabs
        className="flex flex-col h-full overflow-y-auto"
        defaultValue="cardpack"
        tabs={[
          {
            label: '卡包维度',
            value: 'cardpack',
            className: 'flex-1 overflow-y-auto',
            component: (
              <Card className="h-full py-0" contentClassName="h-full overflow-y-auto pt-4">
                <CardpackList wordPack={wordPack} />
              </Card>
            ),
          },
          {
            label: '单词维度',
            value: 'word',
            className: 'flex-1 overflow-y-auto',
            component: (
              <Card className="h-full py-0" contentClassName="h-full overflow-y-auto pt-4">
                <WordList wordPack={wordPack} />
              </Card>
            ),
          },
        ]}
      />
    </Page>
  )
}
