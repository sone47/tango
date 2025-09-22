import { useState } from 'react'

import { LanguageEnum } from '@/constants/language'
import { useExamples } from '@/hooks/useExamples'
import { usePartOfSpeechText } from '@/hooks/usePartOfSpeechText'
import { cn } from '@/lib/utils'
import { Word } from '@/types'

import Typography from '../Typography'
import { Badge } from '../ui/badge'

interface CardPreviewProps {
  language: LanguageEnum
  word: Word
  className?: string
  backClassName?: string
}

const CardPreview = ({ language, word, className, backClassName }: CardPreviewProps) => {
  const [isFlipped, setIsFlipped] = useState(false)
  const { getPartOfSpeechText } = usePartOfSpeechText(language)
  const { examples, loading: examplesLoading } = useExamples(word.id)

  const partOfSpeech = getPartOfSpeechText(word.partOfSpeech)

  const handleCardClick = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <div
      className={cn('relative h-full min-h-[200px] cursor-pointer perspective-[1000px]', className)}
      onClick={handleCardClick}
    >
      <div
        className={cn(
          'relative h-full w-full transition-transform duration-600 transform-3d',
          isFlipped && 'rotate-y-180'
        )}
      >
        <div className="bg-muted absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-2xl p-6 backface-hidden">
          <span className="text-secondary-foreground text-xl font-medium">{word.phonetic}</span>
          <span className="text-foreground text-3xl font-bold">{word.word}</span>
          <span className="text-muted-foreground text-center text-lg">
            {partOfSpeech ? `[${partOfSpeech}] ` : ''}
            {word.definition}
          </span>
        </div>

        <div
          className={cn(
            'bg-muted absolute inset-0 flex rotate-y-180 flex-col items-center gap-2 rounded-2xl p-4 backface-hidden',
            backClassName
          )}
        >
          <Typography.Title level={6}>例句</Typography.Title>
          <div className="w-full flex-1 overflow-y-auto">
            {examplesLoading ? (
              <div className="text-muted-foreground text-center text-sm">加载例句中...</div>
            ) : examples.length > 0 ? (
              <div className="flex flex-col gap-3">
                {examples.map((example) => (
                  <div
                    key={example.id}
                    className="border-primary bg-card flex flex-row items-end justify-between gap-1 rounded-lg p-4"
                  >
                    <div className="flex flex-col gap-1">
                      <Typography.Text type="secondary" size="sm" className="!font-medium">
                        {example.content}
                      </Typography.Text>
                      {example.translation && (
                        <Typography.Text type="secondary" size="xs">
                          {example.translation}
                        </Typography.Text>
                      )}
                    </div>

                    {example.isAi && (
                      <Badge variant="secondary" className="font-medium">
                        AI
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <Typography.Text
                type="secondary"
                size="sm"
                className="flex h-full items-center justify-center italic"
              >
                暂无例句
              </Typography.Text>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardPreview
