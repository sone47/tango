import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { Card as UICard, CardContent, CardHeader } from '@/components/ui/card'
import { baseStyles, colors } from '@/constants/styles'
import { cn } from '@/lib/utils'

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
    return (
      <div className="flex items-center gap-3">
        {Icon && (
          <div className={`${baseStyles.iconContainer} ${iconColor ? colors.icon[iconColor] : ''}`}>
            <Icon size={20} />
          </div>
        )}
        {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
      </div>
    )
  }

  const cardContent = (
    <>
      {(title || Icon) && <CardHeader>{renderTitle()}</CardHeader>}
      <CardContent className={cn(title || Icon ? '' : 'pt-0')}>{children}</CardContent>
    </>
  )

  const cardClassName = cn('backdrop-blur-sm shadow-lg border-none', className)

  if (onClick) {
    return (
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay }}
        className="text-left w-full"
        onClick={onClick}
        whileTap={whileTap ? { scale: 0.98 } : undefined}
      >
        <UICard className={cardClassName}>{cardContent}</UICard>
      </motion.button>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <UICard className={cardClassName}>{cardContent}</UICard>
    </motion.div>
  )
}

export default Card
