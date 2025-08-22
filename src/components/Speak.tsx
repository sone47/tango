import { Volume2 } from 'lucide-react'
import { useEffect, useRef } from 'react'

import Button from '@/components/Button'
import { useTTS } from '@/hooks/useTTS'

interface SpeakProps {
  audioUrl?: string
  text: string
  autoPlay?: boolean
  size?: 'sm' | 'md' | 'lg'
  onPlay?: () => void
}

const Speak = ({ text, audioUrl, autoPlay = false, size = 'md', onPlay }: SpeakProps) => {
  const playButtonRef = useRef<HTMLButtonElement>(null)

  const { start, isGlobalLoading } = useTTS(text)

  useEffect(() => {
    if (autoPlay) {
      playButtonRef.current?.click()
    }
  }, [autoPlay])

  const handlePlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (audioUrl) {
      const audio = new Audio(audioUrl)
      audio.play()
    } else {
      start()
    }

    onPlay?.()
  }

  return (
    <Button
      ref={playButtonRef}
      variant="ghost"
      onClick={handlePlay}
      icon={Volume2}
      loading={isGlobalLoading}
      size={size}
      className="!p-0 h-auto"
    ></Button>
  )
}

export default Speak
