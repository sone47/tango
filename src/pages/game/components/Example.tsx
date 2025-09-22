import { Loader2, Star } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Speak, { SpeakRef } from '@/components/Speak'
import Typography from '@/components/Typography'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { cn } from '@/lib/utils'
import { exampleService } from '@/services/exampleService'
import { Example, Word } from '@/types'

export interface ExampleItem extends Example {
  wordPosition: number
  isGenerating?: boolean
  isCollected: boolean
  innerId: number
}

interface ExampleProps {
  isFlipped: boolean
  word: Word
  example: ExampleItem
  onCollectToggleSuccess: (example: ExampleItem) => void
}

const ExampleComponent = ({ example, isFlipped, word, onCollectToggleSuccess }: ExampleProps) => {
  const [toggleStarLoading, setToggleStarLoading] = useState(false)

  const speakRef = useRef<SpeakRef>(null)
  const hasPlayedAudio = useRef(false)
  const isAudioAvailable = useRef(false)

  useEffect(() => {
    if (isFlipped) {
      if (!isAudioAvailable.current) return

      playAudioOnce()
    } else {
      speakRef.current?.stop()
    }
  }, [isFlipped])

  const handleToggleStar = async (example: ExampleItem) => {
    if (example.isCollected) {
      handleDeleteStar(example)
    } else {
      handleAddStar(example)
    }
  }

  const handleDeleteStar = async (example: ExampleItem) => {
    try {
      setToggleStarLoading(true)
      await exampleService.deleteExample(example.id)

      onCollectToggleSuccess({
        ...example,
        isCollected: false,
      })
    } catch (error) {
      console.error(error)
      toast.error('删除例句失败')
    } finally {
      setToggleStarLoading(false)
    }
  }

  const handleAddStar = async (example: ExampleItem) => {
    try {
      setToggleStarLoading(true)

      const newExample = await exampleService.addExample({
        vocabularyId: example.vocabularyId,
        content: example.content,
        translation: example.translation,
        isAi: example.isAi,
      })

      onCollectToggleSuccess({
        ...newExample,
        innerId: example.innerId,
        wordPosition: example.wordPosition,
        isGenerating: example.isGenerating,
        isCollected: true,
      })
    } catch (error) {
      console.error(error)
      toast.error('收藏例句失败')
    } finally {
      setToggleStarLoading(false)
    }
  }

  const playAudioOnce = () => {
    if (hasPlayedAudio.current) return

    speakRef.current?.play()
    hasPlayedAudio.current = true
  }

  const handlePlayAvailable = () => {
    isAudioAvailable.current = true

    if (!isFlipped) return

    playAudioOnce()
  }

  return (
    <div className="space-between bg-card flex min-h-[50px] w-full items-stretch gap-1 rounded-lg p-4">
      <div className="flex flex-1 flex-col justify-start gap-2 text-left">
        {example.isGenerating && !example.content ? (
          <Skeleton className="h-4 w-[250px]" />
        ) : (
          <Typography.Text type="secondary" size="sm" className="!font-medium">
            {example.wordPosition >= 0 ? (
              <>
                {example.content.slice(0, example.wordPosition)}
                <span className="text-primary">
                  {example.content.slice(
                    example.wordPosition,
                    example.wordPosition + word.word.length
                  )}
                </span>
                {example.content.slice(example.wordPosition + word.word.length)}
              </>
            ) : (
              example.content
            )}
          </Typography.Text>
        )}
        {example.isGenerating && !example.translation ? (
          <Skeleton className="h-4 w-[200px]" />
        ) : (
          example.translation && (
            <Typography.Text type="secondary" size="xs">
              {example.translation}
            </Typography.Text>
          )
        )}
      </div>
      <div className="flex flex-col items-end justify-between gap-1">
        {!example.isGenerating && (
          <>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => handleToggleStar(example)}
                className="h-auto !p-0"
              >
                {toggleStarLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Star
                    className={cn(
                      'size-4',
                      example.isCollected ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                )}
              </Button>
              <Speak
                ref={speakRef}
                text={example.content}
                buttonProps={{
                  className: 'text-muted-foreground',
                }}
                onPlayAvailable={handlePlayAvailable}
              />
            </div>
            {example.isAi && (
              <Badge variant="secondary" className="font-medium">
                AI
              </Badge>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ExampleComponent
