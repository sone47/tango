import { cn } from '@/lib/utils'

interface FlashCardHeaderProps {
  currentIndex: number
  totalCount: number
  variant?: 'light' | 'dark'
  className?: string
}

const FlashCardHeader = ({
  currentIndex,
  totalCount,
  variant = 'light',
  className = '',
}: FlashCardHeaderProps) => {
  const baseClasses = 'flex items-center justify-between'
  const variantClasses = {
    light: 'bg-gray-100/80 backdrop-blur-sm text-gray-600',
    dark: 'bg-white/80 backdrop-blur-sm text-gray-600',
  }

  return (
    <div className={cn(baseClasses, className)}>
      <div className={`${variantClasses[variant]} px-3 py-1 rounded-full text-sm font-medium`}>
        {currentIndex + 1}/{totalCount}
      </div>
      <div></div>
    </div>
  )
}

export default FlashCardHeader
