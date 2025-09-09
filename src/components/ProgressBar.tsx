interface ProgressBarProps {
  progress: number
  height?: 'sm' | 'md' | 'lg'
  showPercentage?: boolean
  animated?: boolean
  className?: string
}

const ProgressBar = ({
  progress,
  height = 'md',
  showPercentage = false,
  animated = true,
  className = '',
}: ProgressBarProps) => {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) {
      return 'bg-green-500'
    } else if (progress >= 60) {
      return 'bg-yellow-500'
    } else {
      return 'bg-red-500'
    }
  }

  const getHeightClass = (height: string) => {
    switch (height) {
      case 'sm':
        return 'h-1'
      case 'lg':
        return 'h-3'
      default:
        return 'h-2'
    }
  }

  return (
    <div className={className}>
      {showPercentage && (
        <div className="mb-1 flex justify-between text-sm text-gray-600">
          <span>进度</span>
          <span>{progress}%</span>
        </div>
      )}
      <div className={`w-full rounded-full bg-gray-200 ${getHeightClass(height)}`}>
        <div
          className={`
            ${getHeightClass(height)} 
            rounded-full 
            ${getProgressColor(progress)}
            ${animated ? 'transition-all duration-300' : ''}
          `}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressBar
