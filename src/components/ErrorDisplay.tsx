import { AlertTriangle } from 'lucide-react'

import Button from './Button'

interface ErrorDisplayProps {
  title?: string
  message?: string
  onRetry?: () => void
  retryText?: string
}

const ErrorDisplay = ({ title, message, onRetry, retryText = '重试' }: ErrorDisplayProps) => {
  return (
    <div className="h-full bg-gradient-to-br from-red-50 to-rose-50 flex items-center justify-center p-6">
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-sm border border-red-50 p-8 max-w-sm w-full">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 bg-red-50 rounded-2xl flex items-center justify-center">
            <AlertTriangle className="w-10 h-10 text-red-500" strokeWidth={1.5} />
          </div>

          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}

          {message && <p className="text-gray-600 text-sm leading-relaxed">{message}</p>}

          {onRetry && (
            <Button onClick={onRetry} variant="primary" size="md" rounded="xl" fullWidth>
              {retryText}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorDisplay
