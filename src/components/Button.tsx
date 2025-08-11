import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface ButtonProps {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  loading?: boolean
  fullWidth?: boolean
  disabled?: boolean
  className?: string
  onClick?: (event: React.MouseEvent) => void
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  onClick,
}: ButtonProps) => {
  const getVariantStyles = () => {
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
      secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200',
      danger: 'bg-red-600 text-white hover:bg-red-700 active:bg-red-800',
    }
    return variants[variant]
  }

  const getSizeStyles = () => {
    const sizes = {
      xs: 'px-2 py-1 text-xs',
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg',
      xl: 'px-8 py-4 text-xl',
    }
    return sizes[size]
  }

  const getRoundedStyles = () => {
    const roundedMap = {
      xs: 'rounded-xs',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    }
    return roundedMap[size]
  }

  const getIconSize = () => {
    const iconSizes = {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
    }
    return iconSizes[size]
  }

  const isDisabled = disabled || loading

  return (
    <motion.button
      className={`
        font-medium transition-colors
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${getRoundedStyles()}
        ${fullWidth ? 'w-full' : ''}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        flex items-center justify-center gap-2
        ${className}
      `}
      disabled={isDisabled}
      onClick={(event) => onClick?.(event)}
      whileTap={!isDisabled ? { scale: 0.98 } : undefined}
      whileHover={!isDisabled ? { scale: 1.02 } : undefined}
      transition={{ duration: 0.15 }}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {Icon && iconPosition === 'left' && <Icon size={getIconSize()} />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={getIconSize()} />}
    </motion.button>
  )
}

export default Button
