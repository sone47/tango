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
    light: 'bg-muted text-muted-foreground',
    dark: 'bg-card text-muted-foreground',
  }

  return (
    <div className="z-1">
      <div className={cn(baseClasses, className)}>
        <div className={`${variantClasses[variant]} rounded-full px-3 py-1 text-sm font-medium`}>
          {currentIndex + 1}/{totalCount}
        </div>
      </div>
    </div>
  )
}

export default FlashCardHeader
