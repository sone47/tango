
import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router'

import Page from '@/components/Page'
import { wordPackService } from '@/services/wordPackService'
import { WordPack } from '@/types'

import CardpackList from './components/CardpackList'
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
    <Page title={<WordpackEditTitle wordPack={wordPack} />} hasPadding={false}>
      <div className="px-4">
        <CardpackList wordPack={wordPack} />
      </div>
    </Page>
  )
}
