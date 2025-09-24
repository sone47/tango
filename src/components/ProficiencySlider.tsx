import { cn } from '@/lib/utils'

import Slider from './Slider'

interface ProficiencySliderProps {
  value: number
  onChange: (value: number) => void
  onChangeComplete?: (value: number) => void
  disabled?: boolean
  showLabel?: boolean
  showValue?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const ProficiencySlider = ({
  value,
  onChange,
  onChangeComplete,
  disabled = false,
  showLabel = true,
  showValue = true,
  size = 'md',
  className = '',
}: ProficiencySliderProps) => {
  const getTextSize = (size: string) => {
    switch (size) {
      case 'sm':
        return 'text-xs'
      case 'lg':
        return 'text-base'
      default:
        return 'text-sm'
    }
  }

  return (
    <div
      className={cn(
        'backdrop-blur-sm rounded-2xl transition-opacity duration-300 flex-shrink-0 flex flex-col gap-4 shadow-lg',
        className
      )}
    >
      <Slider
        value={value}
        onChange={onChange}
        onChangeComplete={onChangeComplete}
        min={0}
        max={100}
        disabled={disabled}
        size={size}
      />

      {(showLabel || showValue) && (
        <div className="flex items-center justify-between">
          {showLabel && (
            <span
              className={cn(
                'font-medium',
                disabled ? 'text-muted-foreground/70' : 'text-muted-foreground',
                getTextSize(size)
              )}
            >
              熟练度
            </span>
          )}
          {showValue && (
            <span
              className={cn(
                'font-bold',
                disabled ? 'text-primary/70' : 'text-primary',
                getTextSize(size)
              )}
            >
              {value}%
            </span>
          )}
        </div>
      )}
    </div>
  )
}

export default ProficiencySlider
