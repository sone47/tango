import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useLocation, useParams } from 'react-router'

import Button from '@/components/Button'
import Card from '@/components/Card'
import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import Page from '@/components/Page'
import { Tabs } from '@/components/Tabs'
import { wordPackService } from '@/services/wordPackService'
import { WordPack } from '@/types'

import CardPackTab from './components/CardPackTab'
import WordCreatingButton, { WordCreatingButtonRef } from './components/WordCreatingButton'
import WordList from './components/WordList'
import WordpackEditTitle from './components/WordpackEditTitle'

export default function WordPackEditPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { id } = useParams()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [wordPack, setWordPack] = useState<WordPack>()
  const [isEdit, setIsEdit] = useState(false)
  const wordPackId = useMemo(() => +id!, [id])
  const [activeTab, setActiveTab] = useState('cardpack')
  const wordCreatingButtonRef = useRef<WordCreatingButtonRef>(null)

  useEffect(() => {
    if (isNaN(wordPackId)) {
      navigate('/wordpack', { replace: true })
      return
    }

    fetchWordPack()
  }, [wordPackId])

  useEffect(() => {
    if (location.state?.action === 'add-card') {
      handleShowWordCreatingDialog(location.state.cardPackId)
    }
  }, [location.state])

  const fetchWordPack = async () => {
    setIsLoading(true)
    try {
      const wordPack = await wordPackService.getWordPackById(wordPackId)
      if (!wordPack) {
        throw new Error('词包不存在')
      }
      setWordPack(wordPack!)
    } catch (error) {
      setError(error as Error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleWordCreated = () => {
    fetchWordPack()
  }

  if (isLoading) {
    return <Loading />
  }

  if (error) {
    return <ErrorDisplay title="加载失败" onRetry={fetchWordPack} />
  }

  const handleShowWordCreatingDialog = (cardPackId?: number) => {
    setIsEdit(true)
    setTimeout(() => {
      wordCreatingButtonRef.current?.handleClick(cardPackId)
    }, 30)
  }

  return (
    <Page
      title={
        <>
          <WordpackEditTitle wordPack={wordPack!} editable={isEdit} />
          <Button
            className="absolute top-1/2 right-4 -translate-y-1/2  p-0"
            variant="link"
            onClick={() => setIsEdit((prev) => !prev)}
          >
            {isEdit ? '完成' : '编辑'}
          </Button>
        </>
      }
    >
      <Tabs
        className="flex h-full flex-col overflow-y-auto"
        defaultValue="cardpack"
        value={activeTab}
        onValueChange={setActiveTab}
        tabs={[
          {
            label: '卡包维度',
            value: 'cardpack',
            className: 'flex-1 overflow-y-auto',
            component: <CardPackTab wordPack={wordPack!} isEdit={isEdit} onSetIsEdit={setIsEdit} />,
          },
          {
            label: '单词维度',
            value: 'word',
            className: 'flex-1 overflow-y-auto',
            component: (
              <Card className="h-full p-0" contentClassName="h-full overflow-y-auto p-0">
                <WordList
                  wordPack={wordPack!}
                  onShowCreatingDialog={handleShowWordCreatingDialog}
                />
              </Card>
            ),
          },
        ]}
      />

      {isEdit && wordPack && (
        <WordCreatingButton
          wordPack={wordPack}
          onWordCreated={handleWordCreated}
          ref={wordCreatingButtonRef}
        />
      )}
    </Page>
  )
}
