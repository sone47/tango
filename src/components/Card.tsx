import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { baseStyles, colors } from '@/constants/styles'

interface CardProps {
  children: ReactNode
  title?: ReactNode
  icon?: LucideIcon
  iconColor?: keyof typeof colors.icon
  className?: string
  delay?: number
  onClick?: () => void
  whileTap?: boolean
}

const Card = ({
  children,
  title,
  icon: Icon,
  iconColor,
  className = '',
  delay = 0,
  onClick,
  whileTap = false,
}: CardProps) => {
  const renderTitle = () => {
    if (!title && !Icon) return null

    // 如果title是自定义组件，直接渲染
    if (title && typeof title !== 'string') {
      return <div className="mb-4">{title}</div>
    }

    // 如果title是字符串或者只有icon，使用默认布局
    return (
      <div className="flex items-center gap-3 mb-4">
        {Icon && (
          <div className={`${baseStyles.iconContainer} ${colors.icon[iconColor]}`}>
            <Icon size={20} />
          </div>
        )}
        {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
      </div>
    )
  }

  const cardContent = (
    <>
      {renderTitle()}
      {children}
    </>
  )

  if (onClick) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className={`${baseStyles.card} p-6 text-left w-full ${className}`}
        onClick={onClick}
        whileTap={whileTap ? { scale: 0.98 } : undefined}
      >
        {cardContent}
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${baseStyles.card} p-6 ${className}`}
    >
      {cardContent}
    </motion.div>
  )
}

export default Card
