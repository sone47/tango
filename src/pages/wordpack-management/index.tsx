import { motion } from 'framer-motion'
import { Package } from 'lucide-react'
import { useEffect } from 'react'

import Loading from '@/components/Loading'
import NavBar from '@/components/NavBar'
import WordPackItem from '@/components/WordPackItem'
import { spacing } from '@/constants/styles'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { useWordPackStore } from '@/stores/wordPackStore'
import type { WordPack } from '@/types'

const WordPackManagePage = () => {
  const { currentWordPackId, setCurrentWordPackId } = useCurrentWordPack()
  const { allWordPacks, loading, hasData, error, fetchWordPacks } = useWordPackStore()

  useEffect(() => {
    fetchWordPacks()
  }, [fetchWordPacks])

  const handleWordPackSelect = (wordPack: WordPack) => {
    setCurrentWordPackId(wordPack.id!)
  }

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

    if (!hasData || allWordPacks.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无词包</h3>
          <p className="text-sm text-gray-600">请先导入词包数据</p>
        </div>
      )
    }

    return (
      <div className={spacing.listItems}>
        {allWordPacks.map((wordPack, index) => {
          const isSelected = wordPack.id === currentWordPackId

          return (
            <motion.div
              key={wordPack.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.08,
                type: 'spring',
                stiffness: 400,
                damping: 17,
              }}
            >
              <WordPackItem
                wordPack={wordPack}
                isSelected={isSelected}
                onClick={handleWordPackSelect}
                showSelectedBadge={true}
              />
            </motion.div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <NavBar title="词包管理" />

      <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
    </div>
  )
}

export default WordPackManagePage
