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
  color = '#6b7280', // 默认灰色
}: SliderProps) => {
  const getSliderHeight = (size: string) => {
    switch (size) {
      case 'sm':
        return 'h-1'
      case 'lg':
        return 'h-3'
      default:
        return 'h-2'
    }
  }

  // 计算滑块填充的百分比
  const fillPercentage = ((value - min) / (max - min)) * 100

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      onMouseUp={(e) => onChangeComplete?.(Number((e.target as HTMLInputElement).value))}
      onTouchEnd={(e) => onChangeComplete?.(Number((e.target as HTMLInputElement).value))}
      disabled={disabled}
      className={`
        w-full bg-gray-200 rounded-full appearance-none slider transition-opacity
        ${getSliderHeight(size)}
        ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
        ${className}
      `}
      style={{
        background: `linear-gradient(to right, ${color} ${fillPercentage}%, #e5e7eb ${fillPercentage}%)`,
      }}
    />
  )
}

export default Slider
