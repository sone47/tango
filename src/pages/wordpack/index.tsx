import { useEffect } from 'react'

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
        <WordPackList />
        <Footer />
      </div>
    </Page>
  )
}

export default WordPackManagePage
