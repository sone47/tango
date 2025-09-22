import { omit } from 'lodash'
import { Loader2, LucideIcon, Volume, Volume1, Volume2 } from 'lucide-react'
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'

import Button from '@/components/Button'
import { useTTS } from '@/hooks/useTTS'
import { cn } from '@/lib/utils'

interface SpeakProps {
  audioUrl?: string
  text: string
  autoPlay?: boolean
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  buttonProps?: React.ComponentProps<typeof Button>
  onPlayAvailable?: () => void
}

export interface SpeakRef {
  play: () => void
  stop: () => void
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

const Speak = forwardRef<SpeakRef, SpeakProps>(
  (
    { text, audioUrl, autoPlay = false, size = 'md', buttonProps, onPlayAvailable }: SpeakProps,
    ref
  ) => {
    const playButtonRef = useRef<HTMLButtonElement>(null)
    const urlAudioRef = useRef<HTMLAudioElement>(null)

    const { start, mutate, isGlobalLoading, audio: ttsAudio } = useTTS(text)

    const isUrlPlay = !!audioUrl

    useEffect(() => {
      if (isUrlPlay) {
        urlAudioRef.current = new Audio(audioUrl)
        onPlayAvailable?.()

        if (autoPlay) {
          handlePlay()
        }
      } else {
        start()
      }

      return () => {
        if (!isUrlPlay) {
          mutate()
        }

        handleStop()
      }
    }, [])

    useEffect(() => {
      if (isUrlPlay || !ttsAudio.arrayBuffers.length || autoPlay) return

      handleStop()

      setTimeout(() => {
        onPlayAvailable?.()
      }, 100)
    }, [ttsAudio.arrayBuffers.length])

    useImperativeHandle(ref, () => ({
      play: handlePlay,
      stop: handleStop,
    }))

    const handlePlay = () => {
      if (isUrlPlay) {
        urlAudioRef.current?.play()
      } else {
        ttsAudio.play()
      }
    }

    const handleStop = () => {
      if (isUrlPlay) {
        urlAudioRef.current?.pause()
      } else {
        if (ttsAudio.isPlaying) {
          ttsAudio.stop()
        }
      }
    }

    const handlePlayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()

      handleStop()
      handlePlay()
    }

    return (
      <Button
        ref={playButtonRef}
        variant="ghost"
        onClick={handlePlayClick}
        className={cn('h-auto !p-0', buttonProps?.className)}
        disabled={isGlobalLoading}
        {...omit(buttonProps, 'className')}
      >
        {isGlobalLoading ? (
          <Loader2 className={cn('animate-spin', iconSizeMap[size])} />
        ) : (
          <Icon isPlaying={ttsAudio.isPlaying} size={size} />
        )}
      </Button>
    )
  }
)

export default Speak
