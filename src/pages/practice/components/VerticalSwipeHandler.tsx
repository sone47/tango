import { motion } from 'motion/react'
import { ReactNode, useEffect, useState } from 'react'

interface VerticalSwipeHandlerProps {
  children: ReactNode
  enabled: boolean
  onSwipeUpProcess: () => void
  onSwipeDownProcess: () => void
  onSwipeReset?: () => void
  onSwipeUp: () => void
  onSwipeDown: () => void
  distanceThreshold?: number
  velocityThreshold?: number
  exitDuration?: number
  className?: string
}

interface SwipeState {
  dragOffset: number
  isSwipingOut: boolean
}

const VerticalSwipeHandler = ({
  children,
  enabled,
  onSwipeUpProcess,
  onSwipeDownProcess,
  onSwipeReset,
  onSwipeUp,
  onSwipeDown,
  distanceThreshold = 150,
  velocityThreshold = 200,
  exitDuration = 300,
}: VerticalSwipeHandlerProps) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    dragOffset: 0,
    isSwipingOut: false,
  })

  const { dragOffset, isSwipingOut } = swipeState

  useEffect(() => {
    if (dragOffset) {
      if (dragOffset > 0) {
        onSwipeDownProcess()
      } else {
        onSwipeUpProcess()
      }
    } else {
      onSwipeReset?.()
    }
  }, [dragOffset, onSwipeUpProcess, onSwipeDownProcess, onSwipeReset])

  const handleVerticalSwipe = (offsetY: number, velocityY: number) => {
    if (isSwipingOut) return

    const isSwipeUp = offsetY < -distanceThreshold || velocityY < -velocityThreshold
    const isSwipeDown = offsetY > distanceThreshold || velocityY > velocityThreshold

    if (isSwipeUp || isSwipeDown) {
      setSwipeState((prev) => ({ ...prev, isSwipingOut: true }))

      if (isSwipeUp) {
        onSwipeUp()
      } else {
        onSwipeDown()
      }
    } else {
      setSwipeState((prev) => ({ ...prev, dragOffset: 0 }))
    }
  }

  return (
    <motion.div
      className="w-full h-full"
      drag={enabled && !isSwipingOut ? 'y' : false}
      dragSnapToOrigin={true}
      dragElastic={1}
      dragMomentum={false}
      animate={
        isSwipingOut
          ? {
              y: dragOffset > 0 ? '100%' : '-100%',
              opacity: 0,
              scale: 0.5,
              transition: { duration: exitDuration / 1000 },
            }
          : {}
      }
      onDrag={(_, info) => {
        setSwipeState((prev) => ({ ...prev, dragOffset: info.offset.y }))
      }}
      onDragEnd={(_, info) => {
        handleVerticalSwipe(info.offset.y, info.velocity.y)
      }}
    >
      {children}
    </motion.div>
  )
}

export default VerticalSwipeHandler
