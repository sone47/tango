import { useIsFirstRender } from '@uidotdev/usehooks'
import { AlertTriangle } from 'lucide-react'
import { AuthenticationError } from 'openai'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import AlertDialog, { useAlertDialog } from '@/components/AlertDialog'
import Button from '@/components/Button'
import { AnimatedList } from '@/components/magicui/animated-list'
import Speak from '@/components/Speak'
import Typography from '@/components/Typography'
import { Badge } from '@/components/ui/badge'
import { useExampleStream } from '@/hooks/useGenerateWordExample'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils'
import { Word } from '@/types'

interface FlashCardBackProps {
  word: Word
  className?: string
  onScroll: (isScrolling: boolean) => void
  isFlipped: boolean
}

interface Example {
  example: string
  translation: string
  isAi: boolean
  id: number
  wordPosition: number
  isGenerating: boolean
}

const FlashCardBack = ({ word, className, onScroll, isFlipped }: FlashCardBackProps) => {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const generateDisabledDialog = useAlertDialog()
  const generateExampleFailedDialog = useAlertDialog()
  const isFirstRender = useIsFirstRender()
  const { example, translation, isGenerating, generateExample } = useExampleStream()

  const [isScrolling, setIsScrolling] = useState(false)
  const [examples, setExamples] = useState<Example[]>([])
  const [isPlayed, setIsPlayed] = useState(false)

  useEffect(() => {
    if (isScrolling) {
      onScroll(true)
    } else {
      onScroll(false)
    }
  }, [isScrolling, onScroll])

  useEffect(() => {
    if (isGenerating) {
      setExamples([
        ...examples.slice(0, -1),
        {
          ...examples[examples.length - 1],
          example,
          translation,
          wordPosition: getWordPositionInExample(example),
        },
      ])
    } else {
      setExamples([
        ...examples.slice(0, -1),
        {
          ...examples[examples.length - 1],
          isGenerating: false,
        },
      ])
    }
  }, [example, translation, isGenerating])

  useEffect(() => {
    if (!isGenerating) {
      setIsPlayed(false)
    }
  }, [isGenerating])

  const handleGenerateExample = async (event?: React.MouseEvent) => {
    event?.stopPropagation()

    if (isGenerating) return

    if (!checkGenerateEnabled()) {
      generateDisabledDialog.show()
      return
    }

    try {
      setExamples([
        ...examples,
        {
          example,
          translation,
          isAi: true,
          id: examples.length,
          wordPosition: -1,
          isGenerating: true,
        },
      ])

      generateExample(word.word)
    } catch (error) {
      console.error(error)
      if (error instanceof AuthenticationError) {
        generateExampleFailedDialog.show()
      } else {
        console.error(error)
        toast.error('生成例句失败，请联系管理员')
      }
    }
  }

  const checkGenerateEnabled = () => {
    return !!settings.advanced.aiApiKey.trim()
  }

  const getWordPositionInExample = (example: string) => {
    return example.indexOf(word.word)
  }

  if (isFirstRender) {
    if (word.example) {
      setExamples([
        {
          example: word.example,
          translation: '',
          isAi: false,
          id: 0,
          wordPosition: getWordPositionInExample(word.example),
          isGenerating: false,
        },
      ])
    } else {
      handleGenerateExample()
    }
  }

  return (
    <>
      <div
        className={cn('flex-1 w-full backface-hidden rotate-y-180 flex flex-col p-4', className)}
      >
        <div className="flex-1 flex flex-col justify-center text-center gap-3">
          <Typography.Title level={5}>例句</Typography.Title>
          {examples.length > 0 ? (
            <div
              className="max-h-[300px] overflow-y-auto flex flex-col gap-3"
              onClick={(e) => {
                e.stopPropagation()
              }}
              onTouchStart={() => {
                setIsScrolling(true)
              }}
              onTouchEnd={() => {
                setIsScrolling(false)
              }}
            >
              <AnimatedList delay={100}>
                {examples.map((example, index) => (
                  <div
                    key={example.id}
                    className="w-full min-h-[50px] flex items-stretch space-between gap-1 bg-background rounded-lg p-4"
                  >
                    <div className="flex-1 flex flex-col justify-start gap-2 text-left">
                      <Typography.Text type="secondary" size="sm" className="!font-medium">
                        {example.example.slice(0, example.wordPosition)}
                        <span className="text-primary">
                          {example.example.slice(
                            example.wordPosition,
                            example.wordPosition + word.word.length
                          )}
                        </span>
                        {example.example.slice(example.wordPosition + word.word.length)}
                      </Typography.Text>
                      {example.translation && (
                        <Typography.Text type="secondary" size="xs">
                          {example.translation}
                        </Typography.Text>
                      )}
                    </div>
                    {!example.isGenerating && (
                      <div className="flex flex-col items-end justify-between gap-1">
                        <Speak
                          text={example.example}
                          audioUrl={example.isAi ? '' : word.exampleAudio}
                          autoPlay={isFlipped && index === examples.length - 1 && !isPlayed}
                          onPlay={() => {
                            setIsPlayed(true)
                          }}
                        />
                        {example.isAi && (
                          <Badge variant="secondary" className="font-medium">
                            AI
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </AnimatedList>
            </div>
          ) : (
            <div className="text-center py-4 bg-background rounded-lg flex flex-col gap-2">
              <p className="text-secondary-foreground text-base">暂无例句</p>
              <p className="text-muted-foreground text-sm">该词汇还没有添加例句</p>
            </div>
          )}
          {word.word &&
            (isGenerating ? (
              <Button variant="link" onClick={handleGenerateExample} loading={isGenerating}>
                生成中...
              </Button>
            ) : (
              <Button variant="link" onClick={handleGenerateExample}>
                {examples.length > 0 ? '更多例句' : '生成例句'}
              </Button>
            ))}
        </div>

        <Typography.Text type="secondary" size="sm" className="text-center">
          点击返回正面
        </Typography.Text>
      </div>

      <AlertDialog
        open={generateDisabledDialog.isOpen}
        onOpenChange={generateDisabledDialog.setIsOpen}
        title="请先配置 API Key"
        description="请先在设置中配置 API Key，以便生成例句"
        confirmText="去设置"
        onConfirm={() => {
          navigate('/settings/advanced')
        }}
      ></AlertDialog>
      <AlertDialog
        open={generateExampleFailedDialog.isOpen}
        onOpenChange={generateExampleFailedDialog.setIsOpen}
        title={
          <div className="flex items-center justify-center gap-2 text-destructive">
            <AlertTriangle size={20} />
            <span>生成例句失败</span>
          </div>
        }
        description="可能是 API Key 失效了，请重新配置。"
        confirmText="去设置"
        onConfirm={() => {
          navigate('/settings/advanced')
        }}
      ></AlertDialog>
    </>
  )
}

export default FlashCardBack
