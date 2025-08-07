import { Package } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import WordPackItem from '@/components/WordPackItem'
import { spacing } from '@/constants/styles'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { useWordPackStore } from '@/stores/wordPackStore'
import type { WordPack } from '@/types'

interface WordPackSelectorProps {
  onWordPackSelect?: (wordPack: WordPack) => void
}

const WordPackSelector = ({ onWordPackSelect }: WordPackSelectorProps) => {
  const wordPackStore = useWordPackStore()
  const { currentWordPackId, currentWordPack, setCurrentWordPackId } = useCurrentWordPack()
  const [displayWordPacks, setDisplayWordPacks] = useState<WordPack[]>([])

  const fetchDisplayWordPacks = useCallback(async () => {
    const totalLimit = 3

    if (!currentWordPack) {
      setDisplayWordPacks(wordPackStore.allWordPacks.slice(0, totalLimit))
      return
    }

    const otherWordPacks = wordPackStore.allWordPacks.filter((wp) => wp.id !== currentWordPack?.id)

    const result: WordPack[] = []
    if (currentWordPack) {
      result.push(currentWordPack)
    }
    result.push(...otherWordPacks)

    setDisplayWordPacks(result.slice(0, totalLimit))
  }, [currentWordPack, wordPackStore.allWordPacks])

  useEffect(() => {
    fetchDisplayWordPacks()
  }, [fetchDisplayWordPacks])

  const handleWordPackSelect = (wordPack: WordPack) => {
    setCurrentWordPackId(wordPack.id!)
    onWordPackSelect?.(wordPack)
  }

  if (displayWordPacks.length === 0) {
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
      {displayWordPacks.map((wordPack) => {
        const isSelected = wordPack.id === currentWordPackId

        return (
          <WordPackItem
            key={wordPack.id}
            wordPack={wordPack}
            isSelected={isSelected}
            onClick={handleWordPackSelect}
          />
        )
      })}
    </div>
  )
}

export default WordPackSelector
