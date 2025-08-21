import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import Card from '@/components/Card'
import { cn } from '@/lib/utils'

interface SettingItemProps {
  title: string
  description?: string
  icon?: LucideIcon
  children: ReactNode
  className?: string
  isCard?: boolean
}

export default function SettingItem({
  title,
  description,
  icon: Icon,
  children,
  isCard = false,
  className,
}: SettingItemProps) {
  const titleElement = isCard ? null : (
    <div className="flex items-center gap-3">
      {Icon && (
        <div className={`size-8 rounded-lg flex items-center justify-center`}>
          <Icon size={16} />
        </div>
      )}
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">{title}</div>
        {description && <div className="text-xs text-gray-500 mt-0.5">{description}</div>}
      </div>
    </div>
  )

  const content = (
    <div className={cn('flex items-center justify-between gap-8 w-full', className)}>
      {titleElement}
      <div className="flex justify-end flex-1">{children}</div>
    </div>
  )

  return isCard ? (
    <Card title={title} icon={Icon}>
      {content}
    </Card>
  ) : (
    content
  )
}
