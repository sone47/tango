import { motion } from 'framer-motion'

interface SwitchProps {
  checked: boolean
  onChange: (checked: boolean) => void
  disabled?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export default function Switch({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
}: SwitchProps) {
  const sizeConfig = {
    sm: {
      width: 32, // w-8
      height: 16, // h-4
      circleSize: 12, // w-3 h-3
      padding: 2, // p-0.5
    },
    md: {
      width: 40, // w-10
      height: 20, // h-5
      circleSize: 16, // w-4 h-4
      padding: 2, // p-0.5
    },
    lg: {
      width: 48, // w-12
      height: 24, // h-6
      circleSize: 20, // w-5 h-5
      padding: 2, // p-0.5
    },
  }

  const config = sizeConfig[size]
  const translateX = checked ? config.width - config.circleSize - config.padding * 2 : 0

  return (
    <button
      type="button"
      className={`
        relative inline-flex items-center justify-start rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        ${checked ? 'bg-blue-600' : 'bg-gray-300'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-400'}
        ${!disabled && checked ? 'hover:bg-blue-700' : ''}
        ${className}
      `}
      style={{
        width: config.width,
        height: config.height,
        padding: config.padding,
      }}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <motion.div
        className="bg-white rounded-full shadow-lg flex items-center justify-center"
        style={{
          width: config.circleSize,
          height: config.circleSize,
        }}
        animate={{
          x: translateX,
        }}
        transition={{
          type: 'spring',
          stiffness: 700,
          damping: 30,
          duration: 0.2,
        }}
      />
    </button>
  )
}
