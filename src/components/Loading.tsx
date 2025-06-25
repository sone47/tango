import { Loader2 } from 'lucide-react'
import { type FC } from 'react'

interface LoadingProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const Loading: FC<LoadingProps> = ({ text = 'Loading...', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  }

  return (
    <div className={`h-full flex items-center justify-center ${className}`}>
      <div className="text-center">
        <Loader2 className={`animate-spin text-blue-500 mx-auto mb-4 ${sizeClasses[size]}`} />
        <p className={`text-gray-600 ${textSizeClasses[size]}`}>{text}</p>
      </div>
    </div>
  )
}

export default Loading
