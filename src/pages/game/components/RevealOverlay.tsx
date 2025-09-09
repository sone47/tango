import { Pointer } from 'lucide-react'
import { motion } from 'motion/react'
import { ReactNode, useEffect, useState } from 'react'

interface RevealOverlayProps {
  isRevealed: boolean
  label: string
  colorScheme: 'blue' | 'purple' | 'emerald'
  onDragStart: () => void
  onDragEnd: (offsetX: number) => void
  showGuide?: boolean
  children: ReactNode
}

const colorSchemes = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    text: 'text-blue-600',
    trackColor: 'via-blue-400',
  },
  purple: {
    bg: 'bg-purple-50',
    border: 'border-purple-100',
    text: 'text-purple-600',
    trackColor: 'via-purple-400',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    text: 'text-emerald-600',
    trackColor: 'via-emerald-400',
  },
}

const RevealOverlay = ({
  isRevealed,
  label,
  colorScheme,
  onDragStart,
  onDragEnd,
  showGuide = false,
  children,
}: RevealOverlayProps) => {
  const colors = colorSchemes[colorScheme]
  const [isSliding, setIsSliding] = useState(false)
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(null)
  const [shouldHide, setShouldHide] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [shouldSnapBack, setShouldSnapBack] = useState(false)

  // 当isRevealed变为true时，如果正在滑动，继续显示遮挡层直到动画完成
  const showOverlay = !isRevealed || isSliding

  useEffect(() => {
    if (isRevealed && isSliding) {
      // 等待滑动动画完成后隐藏
      const timer = setTimeout(() => {
        setShouldHide(true)
      }, 250)
      return () => clearTimeout(timer)
    }
  }, [isRevealed, isSliding])

  const handleDragStart = () => {
    setIsDragging(true)
    setShouldSnapBack(false)
    onDragStart()
  }

  const handleDragEnd = (_event: any, info: any) => {
    const threshold = 80 // 滑动阈值
    const offsetX = info.offset.x

    setIsDragging(false)

    if (Math.abs(offsetX) >= threshold) {
      // 开始滑动消失动画
      setIsSliding(true)
      setSlideDirection(offsetX > 0 ? 'right' : 'left')

      // 立即调用父组件的 onDragEnd 来更新状态
      onDragEnd(offsetX)
    } else {
      // 没有达到阈值，需要回弹
      setShouldSnapBack(true)

      // 延迟重置回弹状态，确保动画完成
      setTimeout(() => {
        setShouldSnapBack(false)
      }, 300)

      // 调用父组件的 onDragEnd
      onDragEnd(offsetX)
    }
  }

  // 计算滑动目标位置
  const getSlideTarget = () => {
    if (isSliding && slideDirection) {
      return slideDirection === 'right' ? 250 : -250
    }

    return 0
  }

  // 判断是否应该有动画
  const shouldAnimate = !isDragging && (isSliding || shouldSnapBack)

  return (
    <div className="relative w-full">
      {/* 背景内容 */}
      {children}

      {showOverlay && !shouldHide && (
        <motion.div
          className={`absolute inset-0 ${colors.bg} reveal-overlay flex cursor-grab items-center justify-center rounded-md active:cursor-grabbing`}
          drag={!isSliding ? 'x' : false}
          dragConstraints={{ left: -200, right: 200 }}
          dragElastic={0.2}
          dragMomentum={false}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          initial={{ x: 0, opacity: 1 }}
          animate={
            shouldAnimate
              ? {
                  x: getSlideTarget(),
                  opacity: isSliding ? 0 : 1,
                }
              : {}
          }
          transition={
            shouldAnimate
              ? {
                  type: 'spring',
                  damping: isSliding ? 30 : 25,
                  stiffness: isSliding ? 400 : 300,
                  duration: isSliding ? 0.25 : undefined,
                }
              : { duration: 0 }
          }
          whileDrag={{
            scale: 0.95,
          }}
        >
          <div className={`flex items-center ${colors.text} relative font-medium`}>
            {showGuide && !isRevealed && (
              <>
                {/* 滑动轨迹 */}
                <motion.div
                  className="pointer-events-none absolute top-1/2 left-14 -translate-y-1/2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className={`h-1 w-16 bg-gradient-to-r from-transparent ${colors.trackColor} rounded-full to-transparent`}
                    animate={{
                      x: [-30, 30, -30],
                      opacity: [0.3, 0.7, 0.3],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }}
                  />
                </motion.div>
                {/* 小手图标 */}
                <motion.span
                  className="pointer-events-none absolute top-1/2 left-18 -translate-y-1/2 text-2xl"
                  style={{ opacity: 0.6 }}
                  animate={{
                    x: [-25, 25, -25],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Pointer className="h-6 w-6" />
                </motion.span>
              </>
            )}
            {label}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default RevealOverlay
