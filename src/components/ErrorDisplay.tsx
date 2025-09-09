import { Frown } from 'lucide-react'

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
    <div className="h-full bg-background flex items-center justify-center">
      <div className="flex flex-col items-center text-center gap-6">
        <Frown className="size-12 text-secondary-foreground" strokeWidth={1.5} />
        <div>
          {title && <h2 className="text-lg font-semibold text-foreground">{title}</h2>}

          {message && (
            <p className="text-secondary-foreground text-sm leading-relaxed">{message}</p>
          )}
        </div>

        {onRetry && (
          <Button onClick={onRetry} variant="primary" size="md" className="w-full rounded-full">
            {retryText}
          </Button>
        )}
      </div>
    </div>
  )
}

export default ErrorDisplay
