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
  const getProficiencyColor = (proficiency: number) => {
    // 将熟练度值限制在0-100范围内
    const normalizedValue = Math.max(0, Math.min(100, proficiency))

    if (normalizedValue <= 60) {
      // 0-60%: 从红色到黄色的渐变
      const ratio = normalizedValue / 60
      const red = 239
      const green = Math.round(68 + (185 - 68) * ratio)
      const blue = Math.round(68 + (11 - 68) * ratio)
      return `rgb(${red}, ${green}, ${blue})`
    } else {
      // 60-100%: 从黄色到绿色的渐变
      const ratio = (normalizedValue - 60) / 40
      const red = Math.round(245 - (245 - 16) * ratio)
      const green = Math.round(158 + (185 - 158) * ratio)
      const blue = Math.round(11 + (129 - 11) * ratio)
      return `rgb(${red}, ${green}, ${blue})`
    }
  }

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
    <div className={className}>
      {(showLabel || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {showLabel && (
            <span
              className={`font-medium ${disabled ? 'text-gray-400' : 'text-gray-700'} ${getTextSize(size)}`}
            >
              熟练度
            </span>
          )}
          {showValue && (
            <span
              className={`font-bold ${disabled ? 'text-gray-400' : 'text-gray-900'} ${getTextSize(size)}`}
            >
              {value}%
            </span>
          )}
        </div>
      )}

      <Slider
        value={value}
        onChange={onChange}
        onChangeComplete={onChangeComplete}
        min={0}
        max={100}
        disabled={disabled}
        size={size}
        color={getProficiencyColor(value)}
      />
    </div>
  )
}

export default ProficiencySlider
