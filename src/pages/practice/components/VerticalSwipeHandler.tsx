import { motion } from 'framer-motion'
import { ReactNode, useState } from 'react'

interface VerticalSwipeHandlerProps {
  children: ReactNode
  enabled: boolean
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
  onSwipeUp,
  onSwipeDown,
  distanceThreshold = 150,
  velocityThreshold = 300,
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

  const handleVerticalSwipe = (offsetY: number, velocityY: number) => {
    if (!enabled || isExiting) return

    const isSwipeUp =
      offsetY < -distanceThreshold || (offsetY < -50 && velocityY < -velocityThreshold)
    const isSwipeDown =
      offsetY > distanceThreshold || (offsetY > 50 && velocityY > velocityThreshold)

    if (isSwipeUp || isSwipeDown) {
      // 立即开始退出动画，不回弹
      setSwipeState((prev) => ({ ...prev, isExiting: true, shouldSnapBack: false }))

      // 延迟执行回调，让退出动画完成
      setTimeout(() => {
        if (isSwipeUp) {
          onSwipeUp()
        } else {
          onSwipeDown()
        }
        // 重置状态
        setSwipeState({
          isDragging: false,
          dragOffset: 0,
          isExiting: false,
          shouldSnapBack: false,
        })
      }, exitDuration)
    } else {
      // 没有达到阈值，需要回弹
      setSwipeState((prev) => ({ ...prev, dragOffset: 0, shouldSnapBack: true }))

      // 延迟重置回弹状态
      setTimeout(() => {
        setSwipeState((prev) => ({ ...prev, shouldSnapBack: false }))
      }, 300)
    }
  }

  // 计算退出动画的目标位置
  const getExitTarget = () => {
    if (!isExiting) return 0
    return dragOffset > 0 ? 400 : -400
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
                y: isExiting ? getExitTarget() : shouldSnapBack ? 0 : dragOffset,
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
