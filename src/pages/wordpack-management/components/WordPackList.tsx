import { motion } from 'motion/react'

import WordPackItem from '@/components/WordPackItem'
import { spacing } from '@/constants/styles'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { useWordPackStore } from '@/stores/wordPackStore'
import { WordPack } from '@/types'

const WordPackList = () => {
  const { currentWordPackId, setCurrentWordPackId } = useCurrentWordPack()
  const { allWordPacks } = useWordPackStore()

  const handleWordPackSelect = (wordPack: WordPack) => {
    setCurrentWordPackId(wordPack.id!)
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
