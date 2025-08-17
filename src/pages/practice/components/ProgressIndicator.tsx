interface ProgressIndicatorProps {
  currentIndex: number
  totalCount: number
  variant?: 'light' | 'dark'
  className?: string
}

const ProgressIndicator = ({
  currentIndex,
  totalCount,
  variant = 'light',
  className = '',
}: ProgressIndicatorProps) => {
  const baseClasses = 'absolute top-4 left-4'
  const variantClasses = {
    light: 'bg-gray-100/80 backdrop-blur-sm text-gray-600',
    dark: 'bg-white/80 backdrop-blur-sm text-gray-600',
  }

  return (
    <div className={`${baseClasses} ${className}`}>
      <div className={`${variantClasses[variant]} px-3 py-1 rounded-full text-sm font-medium`}>
        {currentIndex + 1}/{totalCount}
      </div>
    </div>
  )
}

export default ProgressIndicator
