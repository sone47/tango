import { useEffect } from 'react'

import Card from '@/components/Card'
import Page from '@/components/Page'
import { useWordPackStore } from '@/stores/wordPackStore'

import Footer from './components/Footer'
import WordPackList from './components/WordPackList'

const WordPackManagePage = () => {
  const { fetchWordPacks } = useWordPackStore()

  useEffect(() => {
    fetchWordPacks()
  }, [])

  return (
    <Page title="词包管理">
      <div className="h-full flex flex-col gap-4 pb-4">
        <Card className="flex-1 overflow-y-auto" contentClassName="h-full">
          <WordPackList />
        </Card>
        <Footer />
      </div>
    </Page>
  )
}

export default WordPackManagePage
