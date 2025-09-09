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
  titleClassName?: string
}

export default function SettingItem({
  title,
  description,
  icon: Icon,
  children,
  isCard = false,
  className,
  titleClassName,
}: SettingItemProps) {
  const titleElement = isCard ? null : (
    <div className="flex items-center gap-3">
      {Icon && (
        <div className={`flex size-8 items-center justify-center rounded-lg`}>
          <Icon size={16} />
        </div>
      )}
      <div className="flex-1">
        <div className={cn('text-sm font-medium text-gray-900', titleClassName)}>{title}</div>
        {description && <div className="mt-0.5 text-xs text-gray-500">{description}</div>}
      </div>
    </div>
  )

  const content = (
    <div className={cn('flex items-center justify-between gap-8 w-full', className)}>
      {titleElement}
      <div className="flex flex-1 justify-end">{children}</div>
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
