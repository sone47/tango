import { isNil } from 'lodash'

import WordEditButton from '@/components/tango/WordEditButton'
import Typography from '@/components/Typography'
import { LanguageEnum, PartOfSpeechEnum, partOfSpeechToLanguageMap } from '@/constants/language'
import { Word } from '@/types'

interface WordItemProps {
  language: LanguageEnum
  word: Word
  onEditSuccess?: (updatedWord: Word) => void
  wordPackId: number
}

const WordItem = ({ language, word, onEditSuccess, wordPackId }: WordItemProps) => {
  const partOfSpeechMap = partOfSpeechToLanguageMap[language] as Record<PartOfSpeechEnum, string>
  const partOfSpeech =
    word.partOfSpeech === PartOfSpeechEnum.unknown || isNil(word.partOfSpeech)
      ? ''
      : partOfSpeechMap[word.partOfSpeech]

  return (
    <div className="flex flex-row gap-2">
      <div className="flex w-full flex-1 flex-col gap-1 truncate">
        <Typography.Text className="truncate">
          {word.word} | {word.phonetic}
        </Typography.Text>
        <Typography.Text type="secondary" size="sm" className="truncate">
          {partOfSpeech && `[${partOfSpeech}]`}
          {word.definition}
        </Typography.Text>
      </div>
      <WordEditButton wordPackId={wordPackId} word={word} onSuccess={onEditSuccess} />
    </div>
  )
}

export default WordItem
