import { useCallback, useRef } from 'react'

type UseDoubleClickProps = {
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void
  onDoubleClick?: (e: React.MouseEvent | React.TouchEvent) => void
  delay?: number
  dragThreshold?: number
}

interface TouchPoint {
  x: number
  y: number
}

export function useDoubleClick({
  onClick,
  onDoubleClick,
  delay = 300,
  dragThreshold = 10,
}: UseDoubleClickProps) {
  const lastTap = useRef<number>(0)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const startPoint = useRef<TouchPoint | null>(null)
  const isDragging = useRef<boolean>(false)
  const touchHandled = useRef<boolean>(false)

  const getEventPoint = (e: React.MouseEvent | React.TouchEvent): TouchPoint => {
    if ('touches' in e && e.touches.length > 0) {
      return {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
    } else if ('changedTouches' in e && e.changedTouches.length > 0) {
      return {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      }
    } else if ('clientX' in e) {
      return {
        x: e.clientX,
        y: e.clientY,
      }
    }
    return { x: 0, y: 0 }
  }

  const calculateDistance = (start: TouchPoint, end: TouchPoint): number => {
    const dx = end.x - start.x
    const dy = end.y - start.y
    return Math.sqrt(dx * dx + dy * dy)
  }

  const isTouchEvent = (e: React.MouseEvent | React.TouchEvent): boolean => {
    return 'touches' in e || 'changedTouches' in e
  }

  const handleStart = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    if (isTouchEvent(e)) {
      touchHandled.current = true
      setTimeout(() => {
        touchHandled.current = false
      }, 500)
    } else if (touchHandled.current) {
      return
    }

    startPoint.current = getEventPoint(e)
    isDragging.current = false
  }, [])

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isTouchEvent(e) && touchHandled.current) {
        return
      }

      if (!startPoint.current) return

      const currentPoint = getEventPoint(e)
      const distance = calculateDistance(startPoint.current, currentPoint)

      if (distance > dragThreshold) {
        isDragging.current = true
        if (timeout.current) {
          clearTimeout(timeout.current)
          timeout.current = null
        }
      }
    },
    [dragThreshold]
  )

  const handleEnd = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      if (!isTouchEvent(e) && touchHandled.current) {
        return
      }

      if (isDragging.current) {
        isDragging.current = false
        startPoint.current = null
        return
      }

      const now = Date.now()

      if (now - lastTap.current < delay) {
        if (timeout.current) {
          clearTimeout(timeout.current)
          timeout.current = null
        }
        onDoubleClick?.(e)
        lastTap.current = 0
      } else {
        timeout.current = setTimeout(() => {
          if (!isDragging.current) {
            onClick?.(e)
          }
          timeout.current = null
        }, delay)
        lastTap.current = now
      }

      startPoint.current = null
    },
    [onClick, onDoubleClick, delay]
  )

  return {
    onMouseDown: handleStart,
    onMouseMove: handleMove,
    onMouseUp: handleEnd,
    onTouchStart: handleStart,
    onTouchMove: handleMove,
    onTouchEnd: handleEnd,
  }
}
