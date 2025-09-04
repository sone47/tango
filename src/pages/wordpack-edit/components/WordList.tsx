import { useDebounce } from '@uidotdev/usehooks'
import { Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { List } from 'react-window'

import Input from '@/components/Input'
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
  const [searchText, setSearchText] = useState('')
  const [searchedWords, setSearchedWords] = useState<Word[]>([])

  const debouncedSearchText = useDebounce(searchText, 500)

  useEffect(() => {
    if (!debouncedSearchText) {
      setSearchedWords(words)
      return
    }

    setSearchedWords(
      words.filter(
        (word) =>
          word.word.includes(debouncedSearchText) || word.phonetic?.includes(debouncedSearchText)
      )
    )
  }, [words, debouncedSearchText])

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

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchText(value)
  }

  return (
    <div className="h-full flex flex-col">
      <div className="mx-4 mt-4 relative">
        <Search className="h-full absolute left-3 size-4 top-1/2 -translate-y-1/2 text-muted-foreground/70"></Search>
        <Input className="pl-10" placeholder="查询你要修改的单词" onChange={handleSearch} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <List
          rowComponent={({ style, index }) => (
            <div style={style} className="p-4">
              <WordItem language={wordPack!.language} word={searchedWords[index]} />
            </div>
          )}
          rowCount={searchedWords.length}
          rowHeight={70}
          rowProps={{ words: searchedWords }}
        />
      </div>
    </div>
  )
}

export default WordList
