import { Loader2, LucideIcon, Volume, Volume1, Volume2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import Button from '@/components/Button'
import { useTTS } from '@/hooks/useTTS'
import { cn } from '@/lib/utils'

interface SpeakProps {
  audioUrl?: string
  text: string
  autoPlay?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  onPlay?: () => void
  buttonProps?: React.ComponentProps<typeof Button>
}

const iconSizeMap = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
  xl: 'size-6',
  '2xl': 'size-8',
}

const Icon = ({ isPlaying, size = 'md' }: { isPlaying: boolean; size?: SpeakProps['size'] }) => {
  const iconSequence = [Volume, Volume1, Volume2]
  const staticIndex = 2
  const intervalTime = 300

  const [CurrentIcon, setCurrentIcon] = useState<LucideIcon>(iconSequence[staticIndex])
  const currentIconIndex = useRef(0)
  const animationFrameId = useRef<number | null>(null)
  const lastUpdateTime = useRef(0)

  useEffect(() => {
    if (isPlaying) {
      currentIconIndex.current = 0
      lastUpdateTime.current = performance.now()
      startAnimation()
    } else {
      stopAnimation()
      setCurrentIcon(iconSequence[staticIndex])
    }

    return () => {
      stopAnimation()
    }
  }, [isPlaying])

  const startAnimation = () => {
    const animate = (currentTime: number) => {
      if (!isPlaying) return

      const deltaTime = currentTime - lastUpdateTime.current

      if (deltaTime >= intervalTime) {
        setCurrentIcon(iconSequence[currentIconIndex.current % iconSequence.length])
        currentIconIndex.current++
        lastUpdateTime.current = currentTime
      }

      animationFrameId.current = requestAnimationFrame(animate)
    }

    animationFrameId.current = requestAnimationFrame(animate)
  }

  const stopAnimation = () => {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current)
      animationFrameId.current = null
    }
  }

  return <CurrentIcon className={cn(iconSizeMap[size])} />
}

const Speak = ({
  text,
  audioUrl,
  autoPlay = false,
  size = 'md',
  onPlay,
  buttonProps,
}: SpeakProps) => {
  const playButtonRef = useRef<HTMLButtonElement>(null)

  const { start, isGlobalLoading, audio: ttsAudio } = useTTS(text)

  useEffect(() => {
    if (autoPlay) {
      playButtonRef.current?.click()
    }
  }, [autoPlay])

  const handlePlay = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()

    if (audioUrl) {
      handleUrlPlay()
    } else {
      handleTTSPlay()
    }

    onPlay?.()
  }

  const handleUrlPlay = () => {
    const audio = new Audio(audioUrl)
    audio.play()
  }

  const handleTTSPlay = () => {
    if (ttsAudio.arrayBuffers.length) {
      if (ttsAudio.isPlaying) {
        ttsAudio.stop()
      }

      ttsAudio.play()
    } else {
      start()
    }
  }

  return (
    <Button
      ref={playButtonRef}
      variant="ghost"
      onClick={handlePlay}
      className="!p-0 h-auto"
      disabled={isGlobalLoading}
      {...buttonProps}
    >
      {isGlobalLoading ? (
        <Loader2 className={cn('animate-spin', iconSizeMap[size])} />
      ) : (
        <Icon isPlaying={ttsAudio.isPlaying} size={size} />
      )}
    </Button>
  )
}

export default Speak
