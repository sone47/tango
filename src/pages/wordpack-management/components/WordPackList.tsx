import { motion } from 'motion/react'

import EmptyWordPack from '@/components/EmptyWordPack'
import Loading from '@/components/Loading'
import WordPackItem from '@/components/WordPackItem'
import { spacing } from '@/constants/styles'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { useWordPackStore } from '@/stores/wordPackStore'
import { WordPack } from '@/types'

const WordPackList = () => {
  const { currentWordPackId, setCurrentWordPackId } = useCurrentWordPack()
  const { allWordPacks, loading, error, hasData } = useWordPackStore()

  const handleWordPackSelect = (wordPack: WordPack) => {
    setCurrentWordPackId(wordPack.id!)
  }

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

  if (!hasData) {
    return <EmptyWordPack showImportButton={false} />
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
            />
          </motion.div>
        )
      })}
    </div>
  )
}

export default WordPackList
