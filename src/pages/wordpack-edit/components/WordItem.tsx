import { isNil } from 'lodash'

import WordEditButton from '@/components/tango/WordEditButton'
import Typography from '@/components/Typography'
import { LanguageEnum, PartOfSpeechEnum, partOfSpeechToLanguageMap } from '@/constants/language'
import { Word } from '@/types'

interface WordItemProps {
  language: LanguageEnum
  word: Word
  onEditSuccess?: (updatedWord: Word) => void
}

const WordItem = ({ language, word, onEditSuccess }: WordItemProps) => {
  const partOfSpeechMap = partOfSpeechToLanguageMap[language] as Record<PartOfSpeechEnum, string>
  const partOfSpeech =
    word.partOfSpeech === PartOfSpeechEnum.unknown || isNil(word.partOfSpeech)
      ? ''
      : partOfSpeechMap[word.partOfSpeech]

  return (
    <div className="flex flex-row gap-2">
      <div className="flex-1 flex flex-col gap-1 truncate w-full">
        <Typography.Text className="truncate">
          {word.word} | {word.phonetic}
        </Typography.Text>
        <Typography.Text type="secondary" size="sm" className="truncate">
          {partOfSpeech && `[${partOfSpeech}]`}
          {word.definition}
        </Typography.Text>
      </div>
      <WordEditButton wordPackId={word.cardPackId} word={word} onSuccess={onEditSuccess} />
    </div>
  )
}

export default WordItem
