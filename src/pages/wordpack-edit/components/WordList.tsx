import { useEffect, useState } from 'react'

import Loading from '@/components/Loading'
import { cardPackService } from '@/services/cardPackService'
import { Word, WordPack } from '@/types'

import WordItem from './WordItem'

interface WordListProps {
  wordPack?: WordPack | null
}

const WordList = ({ wordPack }: WordListProps) => {
  const [words, setWords] = useState<Word[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (wordPack) {
      fetchWords(wordPack.id)
    }
  }, [wordPack])

  if (isLoading) {
    return <Loading />
  }

  const fetchWords = async (wordPackId: number) => {
    setIsLoading(true)
    try {
      const cardPacks = await cardPackService.getCardPacksByWordPackId(wordPackId)
      setWords(cardPacks.flatMap((cardPack) => cardPack.words))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {words.map((word) => (
        <WordItem key={word.id} word={word} language={wordPack!.language} />
      ))}
    </div>
  )
}

export default WordList
