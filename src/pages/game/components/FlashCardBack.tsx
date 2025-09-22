import { useIsFirstRender } from '@uidotdev/usehooks'
import { AlertTriangle } from 'lucide-react'
import { AuthenticationError } from 'openai'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

import AlertDialog, { useAlertDialog } from '@/components/AlertDialog'
import Button from '@/components/Button'
import { AnimatedList } from '@/components/magicui/animated-list'
import Typography from '@/components/Typography'
import { useExampleStream } from '@/hooks/useGenerateWordExample'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils'
import { exampleService } from '@/services/exampleService'
import { Word } from '@/types'

import Example, { ExampleItem } from './Example'

interface FlashCardBackProps {
  word: Word
  className?: string
  onScroll: (isScrolling: boolean) => void
  isFlipped: boolean
}

const FlashCardBack = ({ word, className, onScroll, isFlipped }: FlashCardBackProps) => {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const generateDisabledDialog = useAlertDialog()
  const generateExampleFailedDialog = useAlertDialog()
  const isFirstRender = useIsFirstRender()
  const { content, translation, isGenerating, generateExample } = useExampleStream(word.word)

  const [isScrolling, setIsScrolling] = useState(false)
  const [examples, setExamples] = useState<ExampleItem[]>([])

  const currentExampleId = useRef<number>(0)

  useEffect(() => {
    if (isScrolling) {
      onScroll(true)
    } else {
      onScroll(false)
    }
  }, [isScrolling, onScroll])

  useEffect(() => {
    if (!examples.length) return

    const lastExample = examples[examples.length - 1]

    setExamples([
      ...examples.slice(0, -1),
      {
        ...examples[examples.length - 1],
        content: content ? content : lastExample.content,
        translation: translation ? translation : lastExample.translation,
        wordPosition: content ? getWordPositionInExample(content) : lastExample.wordPosition,
        isGenerating,
      },
    ])
  }, [content, translation, isGenerating])

  const handleGenerateExample = async (event?: React.MouseEvent) => {
    event?.stopPropagation()

    if (isGenerating) return

    if (!checkGenerateEnabled()) {
      if (event) {
        generateDisabledDialog.show()
      }
      return
    }

    try {
      currentExampleId.current++

      setExamples([
        ...examples,
        {
          vocabularyId: word.id,
          content,
          translation,
          isAi: true,
          id: currentExampleId.current,
          innerId: currentExampleId.current,
          wordPosition: -1,
          isGenerating: true,
          isCollected: false,
        },
      ])

      generateExample()
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

  const fetchInitExamples = async () => {
    const examples = await exampleService.getExamplesByVocabularyId(word.id)
    if (examples.length) {
      setExamples(
        examples.map((example) => ({
          ...example,
          wordPosition: getWordPositionInExample(example.content),
          isCollected: true,
          innerId: example.id,
        }))
      )

      currentExampleId.current = Math.max(...examples.map((example) => example.id)) + 1
    } else {
      handleGenerateExample()
    }
  }

  const handleCollectToggleSuccess = (example: ExampleItem) => {
    setExamples(
      examples.map((prevExample) =>
        prevExample.innerId === example.innerId ? example : prevExample
      )
    )
  }

  if (isFirstRender) {
    fetchInitExamples()
  }

  return (
    <>
      <div
        className={cn(
          'flex-1 w-full backface-hidden rotate-y-180 flex flex-col p-4',
          isFlipped ? '' : 'opacity-0',
          className
        )}
      >
        <div className="flex flex-1 flex-col justify-center gap-3 text-center">
          <Typography.Title level={5}>例句</Typography.Title>
          {examples.length > 0 ? (
            <div
              className="flex max-h-[300px] flex-col gap-3 overflow-y-auto"
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
                  <Example
                    key={example.innerId}
                    example={example}
                    isFlipped={isFlipped}
                    word={word}
                    onCollectToggleSuccess={handleCollectToggleSuccess}
                    shouldPlayAudio={index === examples.length - 1}
                  />
                ))}
              </AnimatedList>
            </div>
          ) : (
            <div className="bg-card flex flex-col gap-2 rounded-lg py-4 text-center">
              <p className="text-secondary-foreground text-base">暂无例句</p>
              <p className="text-muted-foreground text-sm">该单词还没有添加例句</p>
            </div>
          )}
          {word.word && (
            <div>
              <Button variant="link" onClick={handleGenerateExample} loading={isGenerating}>
                {isGenerating ? '生成中...' : examples.length > 0 ? '更多例句' : '生成例句'}
              </Button>
            </div>
          )}
        </div>

        <Typography.Text type="secondary" size="xs" className="text-center">
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
          <div className="text-destructive flex items-center justify-center gap-2">
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
