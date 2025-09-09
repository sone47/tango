import * as SliderPrimitive from '@radix-ui/react-slider'

import { cn } from '@/lib/utils'

interface SliderProps {
  value: number
  onChange: (value: number) => void
  onChangeComplete?: (value: number) => void
  min?: number
  max?: number
  step?: number
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
  color?: string
  formatValue?: (value: number) => string
  showValue?: boolean
}

const Slider = ({
  value,
  onChange,
  onChangeComplete,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  size = 'md',
  className = '',
  color,
  formatValue,
  showValue = false,
}: SliderProps) => {
  const displayValue = formatValue ? formatValue(value) : value.toString()

  const getTrackSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'data-[orientation=horizontal]:h-1 data-[orientation=vertical]:w-1'
      case 'md':
        return 'data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5'
      case 'lg':
        return 'data-[orientation=horizontal]:h-2 data-[orientation=vertical]:w-2'
      default:
        return 'data-[orientation=horizontal]:h-1.5 data-[orientation=vertical]:w-1.5'
    }
  }

  const getThumbSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    switch (size) {
      case 'sm':
        return 'size-3'
      case 'md':
        return 'size-4'
      case 'lg':
        return 'size-5'
      default:
        return 'size-4'
    }
  }

  const renderValueDisplay = () => {
    if (!showValue) return null

    return (
      <div className="min-w-[2.5rem] text-center text-xs font-medium text-gray-600">
        {displayValue}
      </div>
    )
  }

  const sliderElement = (
    <SliderPrimitive.Root
      data-slot="slider"
      value={[value]}
      onValueChange={(value: number[]) => onChange(value[0])}
      onValueCommit={(value: number[]) => onChangeComplete?.(value[0])}
      min={min}
      max={max}
      disabled={disabled}
      step={step}
      className={cn(
        'relative flex w-full items-center data-[disabled]:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col',
        className
      )}
    >
      <SliderPrimitive.Track
        data-slot="slider-track"
        className={cn(
          'bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5',
          getTrackSizeClasses(size)
        )}
      >
        <SliderPrimitive.Range
          data-slot="slider-range"
          className={cn(
            'bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full'
          )}
          style={{ backgroundColor: color }}
        />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        data-slot="slider-thumb"
        className={cn(
          'border-primary bg-card ring-ring/50 block size-4 shrink-0 rounded-full border shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50',
          getThumbSizeClasses(size)
        )}
        style={{ borderColor: color }}
      />
    </SliderPrimitive.Root>
  )

  return (
    <div className="relative flex flex-1 items-center">
      {sliderElement}
      {renderValueDisplay()}
    </div>
  )
}

export default Slider
