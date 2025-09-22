import { useCallback, useRef } from 'react'

type UseDoubleClickProps = {
  onClick?: (e: React.MouseEvent | React.TouchEvent) => void
  onDoubleClick?: (e: React.MouseEvent | React.TouchEvent) => void
  delay?: number
}

export function useDoubleClick({ onClick, onDoubleClick, delay = 300 }: UseDoubleClickProps) {
  const lastTap = useRef<number>(0)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handler = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      const now = Date.now()

      if (now - lastTap.current < delay) {
        if (timeout.current) {
          clearTimeout(timeout.current)
          timeout.current = null
        }
        onDoubleClick?.(e)
      } else {
        timeout.current = setTimeout(() => {
          onClick?.(e)
          timeout.current = null
        }, delay)
      }

      lastTap.current = now
    },
    [onClick, onDoubleClick, delay]
  )

  return handler
}
