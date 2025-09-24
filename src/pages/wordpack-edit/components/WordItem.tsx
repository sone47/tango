import Dialog, { useDialog } from '@/components/Dialog'
import CardPreview from '@/components/tango/CardPreview'
import WordEditButton from '@/components/tango/WordEditButton'
import Typography from '@/components/Typography'
import { LanguageEnum } from '@/constants/language'
import { usePartOfSpeechText } from '@/hooks/usePartOfSpeechText'
import { Word } from '@/types'

export interface WordItemProps {
  editable: boolean
  language: LanguageEnum
  word: Word
  onEditSuccess?: (updatedWord: Word, oldWord: Word) => void
  onDeleteSuccess?: (wordId: number) => void
  wordPackId: number
}

const WordItem = ({
  editable,
  language,
  word,
  onEditSuccess,
  onDeleteSuccess,
  wordPackId,
}: WordItemProps) => {
  const cardPreviewDialog = useDialog()
  const { getPartOfSpeechText } = usePartOfSpeechText(language)

  const partOfSpeech = getPartOfSpeechText(word.partOfSpeech)

  const handleShowCardPreview = () => {
    cardPreviewDialog.open()
  }

  return (
    <>
      <div className="flex flex-row gap-2">
        <div
          className="flex w-full flex-1 flex-col gap-1 truncate"
          onClick={() => handleShowCardPreview()}
        >
          <Typography.Text className="truncate">
            {word.word} | {word.phonetic}
          </Typography.Text>
          <Typography.Text type="secondary" size="sm" className="truncate">
            {partOfSpeech && `[${partOfSpeech}]`}
            {word.definition}
          </Typography.Text>
        </div>
        {editable && (
          <WordEditButton
            wordPackId={wordPackId}
            word={word}
            onEditSuccess={onEditSuccess}
            onDeleteSuccess={onDeleteSuccess}
          />
        )}
      </div>

      <Dialog
        open={cardPreviewDialog.isOpen}
        onOpenChange={cardPreviewDialog.setIsOpen}
        contentClassName="p-0 h-[300px] bg-transparent border-none shadow-none"
        title="卡片信息预览"
        hideTitle
        showCloseButton={false}
      >
        <CardPreview language={language} word={word} backClassName="pt-6 pb-8" />
      </Dialog>
    </>
  )
}

export default WordItem
