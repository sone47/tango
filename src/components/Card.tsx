import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'

import { Card as UICard, CardContent, CardHeader } from '@/components/ui/card'
import { baseStyles } from '@/constants/styles'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  title?: ReactNode
  icon?: LucideIcon
  iconHasBg?: boolean
  className?: string
  contentClassName?: string
  delay?: number
  onClick?: () => void
  whileTap?: boolean
}

const Card = ({
  children,
  title,
  icon: Icon,
  iconHasBg,
  className = '',
  contentClassName = '',
  delay = 0,
  onClick,
  whileTap = false,
}: CardProps) => {
  const renderTitle = () => {
    return (
      <div className={cn('flex items-center', iconHasBg ? 'gap-3' : '')}>
        {Icon && (
          <div
            className={cn(
              baseStyles.iconContainerLarge,
              iconHasBg ? 'bg-background text-primary' : '',
              iconHasBg ? 'justify-center' : 'justify-start'
            )}
          >
            <Icon size={20} />
          </div>
        )}
        {title && <h2 className="text-lg font-semibold text-gray-900 w-full flex-1">{title}</h2>}
      </div>
    )
  }

  const cardContent = (
    <>
      {(title || Icon) && <CardHeader>{renderTitle()}</CardHeader>}
      <CardContent className={contentClassName}>{children}</CardContent>
    </>
  )

  const cardClassName = cn('backdrop-blur-sm shadow-none border-1 gap-2', className)

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

  return <UICard className={cardClassName}>{cardContent}</UICard>
}

export default Card
