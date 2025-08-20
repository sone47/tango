import { Volume2 } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import AlertDialog, { useAlertDialog } from '@/components/AlertDialog'
import Button from '@/components/Button'
import Typography from '@/components/Typography'
import { useSettings } from '@/hooks/useSettings'
import { Word } from '@/types'
import { textToSpeech } from '@/utils/speechUtils'

interface FlashCardExampleSideProps {
  word: Word
}

const FlashCardExampleSide = ({ word }: FlashCardExampleSideProps) => {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const generateDisabledDialog = useAlertDialog()

  const handlePlayAudio = (text?: string, audioUrl?: string) => {
    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play()
    } else {
      if (!text) return

      textToSpeech(text, settings.speech)
    }
  }

  const handlePlayExampleAudio = (event: React.MouseEvent) => {
    event.stopPropagation()

    handlePlayAudio(word.example, word.exampleAudio)
  }

  const handleGenerateExample = (event: React.MouseEvent) => {
    event.stopPropagation()

    if (!checkGenerateEnabled()) {
      generateDisabledDialog.show()
      return
    }

    console.log('generate example', settings.advanced.aiApiKey)
  }

  const checkGenerateEnabled = () => {
    return settings.advanced.aiApiKey.trim() !== ''
  }

  return (
    <>
      <div className="flex-1 w-full backface-hidden rotate-y-180 flex flex-col">
        <div className="flex-1 flex flex-col justify-center text-center gap-4">
          <div className="flex items-center justify-center">
            <Typography.Title level={5}>例句</Typography.Title>
            {word.example && (
              <Button
                onClick={handlePlayExampleAudio}
                variant="ghost"
                size="sm"
                icon={Volume2}
              ></Button>
            )}
          </div>
          <div className="bg-background/80 p-4 rounded-2xl">
            {word.example ? (
              <span className="text-secondary-foreground">{word.example}</span>
            ) : (
              <div className="text-center py-4">
                <p className="text-gray-500 text-base">暂无例句</p>
                <p className="text-gray-400 text-sm mt-2">该词汇还没有添加例句</p>
              </div>
            )}
          </div>
          <Button variant="link" onClick={handleGenerateExample}>
            更多例句
          </Button>
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
