import { Frown } from 'lucide-react'
import { Link } from 'react-router'

import Button from './Button'

interface ErrorDisplayProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryText?: string
}

const ErrorDisplay = ({
  title,
  message = '如多次重试仍无法解决，请联系开发者',
  onRetry,
  retryText = '重试',
}: ErrorDisplayProps) => {
  return (
    <div className="bg-background flex h-full items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <Frown className="text-secondary-foreground size-12" strokeWidth={1.5} />
        <div>
          {title && <h2 className="text-foreground text-lg font-semibold">{title}</h2>}

          {message && (
            <p className="text-secondary-foreground text-sm leading-relaxed">{message}</p>
          )}
        </div>

        <div className="flex w-full flex-col gap-2">
          {onRetry && (
            <Button onClick={onRetry} variant="primary" size="md" className="w-full rounded-full">
              {retryText}
            </Button>
          )}
          <Link to="/" replace>
            <Button variant="ghost" className="text-secondary-foreground">
              回到首页
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ErrorDisplay
