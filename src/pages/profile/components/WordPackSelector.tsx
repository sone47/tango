import { useCallback, useEffect, useState } from 'react'

import EmptyWordPack from '@/components/EmptyWordPack'
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

  if (!wordPackStore.hasData) {
    return <EmptyWordPack showImportButton={false} />
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
