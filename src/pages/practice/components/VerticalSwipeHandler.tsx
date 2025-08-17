import { motion } from 'framer-motion'
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
  isDragging: boolean
  dragOffset: number
  isExiting: boolean
  shouldSnapBack: boolean
}

const VerticalSwipeHandler = ({
  children,
  enabled,
  onSwipeUpProcess,
  onSwipeDownProcess,
  onSwipeReset,
  onSwipeUp,
  onSwipeDown,
  distanceThreshold = 100,
  velocityThreshold = 200,
  exitDuration = 300,
  className = '',
}: VerticalSwipeHandlerProps) => {
  const [swipeState, setSwipeState] = useState<SwipeState>({
    isDragging: false,
    dragOffset: 0,
    isExiting: false,
    shouldSnapBack: false,
  })

  const { isDragging, dragOffset, isExiting, shouldSnapBack } = swipeState

  useEffect(() => {
    if (Math.abs(dragOffset) > 20) {
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
    if (!enabled || isExiting) return

    const isSwipeUp = offsetY < -distanceThreshold || velocityY < -velocityThreshold
    const isSwipeDown = offsetY > distanceThreshold || velocityY > velocityThreshold

    if (isSwipeUp || isSwipeDown) {
      // 立即开始退出动画，不回弹
      setSwipeState((prev) => ({ ...prev, isExiting: true, shouldSnapBack: false }))

      if (isSwipeUp) {
        onSwipeUp()
      } else {
        onSwipeDown()
      }
    } else {
      // 没有达到阈值，需要回弹
      setSwipeState((prev) => ({ ...prev, dragOffset: 0, shouldSnapBack: true }))
    }
  }

  return (
    <div className={`relative ${className}`}>
      {/* 可拖拽内容 */}
      <motion.div
        className="w-full h-full"
        drag={enabled && !isExiting ? 'y' : false}
        dragConstraints={{ top: -200, bottom: 200 }}
        dragElastic={0}
        dragMomentum={false}
        animate={
          !isDragging
            ? {
                y: dragOffset,
                opacity: isExiting ? 0 : Math.max(0.4, 1 - Math.abs(dragOffset) / 300),
                scale: isExiting ? 0.8 : Math.max(0.85, 1 - Math.abs(dragOffset) / 600),
              }
            : {}
        }
        transition={
          !isDragging
            ? {
                type: 'spring',
                damping: isExiting ? 25 : shouldSnapBack ? 25 : 30,
                stiffness: isExiting ? 300 : shouldSnapBack ? 300 : 400,
                duration: isExiting ? exitDuration / 1000 : undefined,
              }
            : { duration: 0 }
        }
        style={
          isDragging
            ? {
                y: dragOffset,
                opacity: Math.max(0.4, 1 - Math.abs(dragOffset) / 300),
                scale: Math.max(0.85, 1 - Math.abs(dragOffset) / 600),
              }
            : {}
        }
        onDragStart={() => {
          if (enabled) {
            setSwipeState((prev) => ({ ...prev, isDragging: true, shouldSnapBack: false }))
          }
        }}
        onDrag={(_, info) => {
          if (enabled && !isExiting) {
            setSwipeState((prev) => ({ ...prev, dragOffset: info.offset.y }))
          }
        }}
        onDragEnd={(_, info) => {
          setSwipeState((prev) => ({ ...prev, isDragging: false }))
          if (enabled && !isExiting) {
            handleVerticalSwipe(info.offset.y, info.velocity.y)
          }
        }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export default VerticalSwipeHandler
