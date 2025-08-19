import { useEffect } from 'react'

import Card from '@/components/Card'
import EmptyWordPack from '@/components/EmptyWordPack'
import Loading from '@/components/Loading'
import Page from '@/components/Page'
import { useWordPackStore } from '@/stores/wordPackStore'

import Footer from './components/Footer'
import WordPackList from './components/WordPackList'

const WordPackManagePage = () => {
  const { loading, hasData, error, fetchWordPacks } = useWordPackStore()

  useEffect(() => {
    fetchWordPacks()
  }, [])

  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-96">
          <Loading text="加载词包中..." size="md" />
        </div>
      )
    }

    if (error) {
      return (
        <div className="text-center py-8 text-red-600">
          <p>加载失败: {error}</p>
        </div>
      )
    }

    return (
      <div className="h-full flex flex-col gap-4 pb-4">
        <Card className="flex-1 overflow-y-auto" contentClassName="h-full">
          {hasData ? <WordPackList /> : <EmptyWordPack showImportButton={false} />}
        </Card>
        <Footer />
      </div>
    )
  }

  return <Page title="词包管理">{renderContent()}</Page>
}

export default WordPackManagePage
