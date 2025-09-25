import { Lightbulb, Loader2 } from 'lucide-react'
import { useRef, useState } from 'react'

import Button from '@/components/Button'
import Speak, { SpeakRef } from '@/components/Speak'
import { useExamples } from '@/hooks/useExamples'
import { cn } from '@/lib/utils'

interface FlashCardHeaderProps {
  currentIndex: number
  totalCount: number
  variant?: 'light' | 'dark'
  className?: string
  wordId?: number
}

const FlashCardHeader = ({
  currentIndex,
  totalCount,
  variant = 'light',
  className = '',
  wordId,
}: FlashCardHeaderProps) => {
  const variantClasses = {
    light: 'bg-muted text-muted-foreground',
    dark: 'bg-card text-muted-foreground',
  }

  const { examples } = useExamples(wordId)

  const speakRef = useRef<SpeakRef>(null)
  const [hintLoading, setHintLoading] = useState(true)

  const handleShowHint = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    speakRef.current?.play()
  }

  const handlePlayAvailable = () => {
    setHintLoading(false)
  }

  return (
    <>
      <div className="z-1">
        <div className={cn('flex items-center justify-between', className)}>
          <div className={`${variantClasses[variant]} rounded-full px-3 py-1 text-sm font-medium`}>
            {currentIndex + 1}/{totalCount}
          </div>
          {examples[0]?.content && (
            <div>
              <Button variant="ghost" size="icon" onClick={handleShowHint} className="!p-0">
                {hintLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Lightbulb className="text-primary size-4" />
                )}
              </Button>
              <Speak
                ref={speakRef}
                text={examples[0]?.content}
                audioUrl={examples[0]?.audio}
                size="2xl"
                buttonProps={{
                  variant: 'primary',
                  className: '!size-10 !p-8 rounded-2xl hidden',
                }}
                onPlayAvailable={handlePlayAvailable}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default FlashCardHeader
