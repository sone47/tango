import { useDebounce } from '@uidotdev/usehooks'
import { FolderSearch, Search } from 'lucide-react'
import { useEffect, useState } from 'react'
import { List } from 'react-window'

import Button from '@/components/Button'
import Input from '@/components/Input'
import Loading from '@/components/Loading'
import Typography from '@/components/Typography'
import { cardPackService } from '@/services/cardPackService'
import { Word, WordPackEntity } from '@/types'

import WordItem from './WordItem'

interface WordListProps {
  wordPack?: WordPackEntity | null
  onShowCreatingDialog: () => void
}

const WordList = ({ wordPack, onShowCreatingDialog }: WordListProps) => {
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

  const fetchWords = async (wordPackId: number) => {
    setIsLoading(true)
    try {
      const cardPacks = await cardPackService.getCardPacksByWordPackId(wordPackId)
      setWords(cardPacks.flatMap((cardPack) => cardPack.words))
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return <Loading />
  }

  if (!words.length) {
    const handleAddWord = () => {
      onShowCreatingDialog()
    }

    return (
      <div className="flex h-full flex-col items-center justify-center">
        <FolderSearch className="text-muted-foreground mb-4 h-12 w-12" />
        <Typography.Title level={5}>暂无卡片</Typography.Title>
        <Button variant="link" onClick={handleAddWord}>
          添加卡片
        </Button>
      </div>
    )
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchText(value)
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative mx-4 mt-4">
        <Search className="text-muted-foreground/70 absolute top-1/2 left-3 size-4 h-full -translate-y-1/2"></Search>
        <Input className="pl-10" placeholder="查询你要修改的单词" onChange={handleSearch} />
      </div>
      <div className="flex-1 overflow-y-auto">
        <List
          rowComponent={({ style, index }) => (
            <div style={style} className="p-4">
              <WordItem
                language={wordPack!.language}
                word={searchedWords[index]}
                wordPackId={wordPack!.id}
              />
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
