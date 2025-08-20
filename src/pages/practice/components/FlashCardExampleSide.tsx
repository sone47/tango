import { Volume2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

import AlertDialog, { useAlertDialog } from '@/components/AlertDialog'
import Button from '@/components/Button'
import Typography from '@/components/Typography'
import { Badge } from '@/components/ui/badge'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils'
import { Word } from '@/types'
import { generateExample } from '@/utils/ai'
import { textToSpeech } from '@/utils/speechUtils'

interface FlashCardExampleSideProps {
  word: Word
  className?: string
}

const FlashCardExampleSide = ({ word, className }: FlashCardExampleSideProps) => {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const generateDisabledDialog = useAlertDialog()
  const [isGenerating, setIsGenerating] = useState(false)
  const [examples, setExamples] = useState(
    word.example ? [{ example: word.example, translation: '', isAi: false }] : []
  )

  const aiApiKey = settings.advanced.aiApiKey.trim()

  const handlePlayExampleAudio = (example: string, audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play()
    } else {
      if (!example) return

      textToSpeech(example, settings.speech)
    }
  }

  const handleGenerateExample = async (event: React.MouseEvent) => {
    event.stopPropagation()

    if (!checkGenerateEnabled()) {
      generateDisabledDialog.show()
      return
    }

    setIsGenerating(true)
    const example = await generateExample(word.word, aiApiKey)
    if (!example) {
      toast.error('生成例句失败，请重试')
      return
    }

    setExamples([...examples, { ...example, isAi: true }])
    setIsGenerating(false)
  }

  const checkGenerateEnabled = () => {
    return !!aiApiKey
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
              className="max-h-[200px] overflow-y-auto flex flex-col gap-3"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              {examples.map((example, index) => (
                <div
                  key={index}
                  className="w-full flex items-start space-between gap-1 bg-background rounded-lg p-4"
                >
                  <div className="flex-1 flex flex-col justify-start gap-2 text-left">
                    <Typography.Text type="secondary" size="sm" className="!font-medium">
                      {example.example}
                    </Typography.Text>
                    {example.translation && (
                      <Typography.Text type="secondary" size="xs">
                        {example.translation}
                      </Typography.Text>
                    )}
                  </div>
                  <div className="h-full flex flex-col items-center justify-between gap-1">
                    <Button
                      className="justify-start h-auto !p-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePlayExampleAudio(
                          example.example,
                          example.isAi ? '' : word.exampleAudio
                        )
                      }}
                      variant="ghost"
                      size="sm"
                      icon={Volume2}
                    ></Button>
                    {example.isAi && (
                      <Badge variant="secondary" className="font-medium">
                        AI
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 bg-background rounded-lg flex flex-col gap-2">
              <p className="text-secondary-foreground text-base">暂无例句</p>
              <p className="text-muted-foreground text-sm">该词汇还没有添加例句</p>
            </div>
          )}
          {isGenerating ? (
            <Button variant="link" onClick={handleGenerateExample} loading={isGenerating}>
              生成中...
            </Button>
          ) : (
            <Button variant="link" onClick={handleGenerateExample}>
              {examples.length > 0 ? '更多例句' : '生成例句'}
            </Button>
          )}
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
    </>
  )
}

export default FlashCardExampleSide
