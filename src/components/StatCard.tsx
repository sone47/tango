import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { colors } from '@/constants/styles'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  color?: keyof typeof colors.icon
  onClick?: () => void
  suffix?: string
  prefix?: string
  delay?: number
  children?: ReactNode
}

const StatCard = ({
  title,
  value,
  icon: Icon,
  color = 'blue',
  onClick,
  suffix = '',
  prefix = '',
  delay = 0,
  children,
}: StatCardProps) => {
  const Component = onClick ? motion.button : motion.div

  const getGradientColor = (colorKey: keyof typeof colors.icon) => {
    const gradientMap = {
      blue: colors.gradients.blue,
      green: colors.gradients.green,
      purple: colors.gradients.purple,
      orange: colors.gradients.orange,
      red: colors.gradients.red,
      yellow: 'bg-gradient-to-r from-yellow-50 to-amber-50',
    }
    return gradientMap[colorKey]
  }

  const getTextColor = (colorKey: keyof typeof colors.icon, intensity: 'medium' | 'dark') => {
    const colorName = colors.icon[colorKey].split(' ')[1].split('-')[1] // 提取颜色名
    return intensity === 'medium' ? `text-${colorName}-800` : `text-${colorName}-900`
  }

  return (
    <Component
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${getGradientColor(color)} p-4 rounded-xl text-left`}
      onClick={onClick}
      whileTap={onClick ? { scale: 0.95 } : undefined}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className={colors.icon[color].split(' ')[1]} />
        <span className={`text-sm font-medium ${getTextColor(color, 'medium')}`}>{title}</span>
      </div>
      <p className={`text-2xl font-bold ${getTextColor(color, 'dark')}`}>
        {prefix}
        {value}
        {suffix}
      </p>
      {children}
    </Component>
  )
}

export default StatCard
