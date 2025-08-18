import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import {
  DropdownMenu as ShadcnDropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { cn } from '@/lib/utils'

export interface DropdownOption {
  key: string
  label: ReactNode
  icon?: LucideIcon
  onClick?: () => void
  disabled?: boolean
  variant?: 'default' | 'destructive'
}

export interface DropdownGroup {
  type: 'group'
  label?: string
  options: DropdownOption[]
}

export interface DropdownSeparator {
  type: 'separator'
}

export type DropdownItem = DropdownOption | DropdownGroup | DropdownSeparator

export interface DropdownMenuProps {
  children: ReactNode // 触发器内容
  items: DropdownItem[]
  contentClassName?: string
  align?: 'start' | 'center' | 'end'
  side?: 'top' | 'bottom' | 'left' | 'right'
  sideOffset?: number
  disabled?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const isOption = (item: DropdownItem): item is DropdownOption => {
  return 'key' in item && 'label' in item
}

const isGroup = (item: DropdownItem): item is DropdownGroup => {
  return 'type' in item && item.type === 'group'
}

const isSeparator = (item: DropdownItem): item is DropdownSeparator => {
  return 'type' in item && item.type === 'separator'
}

const renderOption = (option: DropdownOption) => {
  const { key, label, icon: Icon, onClick, disabled = false, variant = 'default' } = option

  return (
    <DropdownMenuItem
      key={key}
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      className="cursor-pointer"
    >
      {Icon && <Icon className="mr-2 h-4 w-4" />}
      {label}
    </DropdownMenuItem>
  )
}

const renderGroup = (group: DropdownGroup, index: number) => {
  return (
    <DropdownMenuGroup key={`group-${index}`}>
      {group.label && <DropdownMenuLabel>{group.label}</DropdownMenuLabel>}
      {group.options.map(renderOption)}
    </DropdownMenuGroup>
  )
}

const renderSeparator = (index: number) => {
  return <DropdownMenuSeparator key={`separator-${index}`} />
}

const DropdownMenu = ({
  children,
  items,
  contentClassName,
  align = 'end',
  side = 'bottom',
  sideOffset = 4,
  disabled = false,
  open,
  onOpenChange,
}: DropdownMenuProps) => {
  const renderItems = () => {
    return items.map((item, index) => {
      if (isOption(item)) {
        return renderOption(item)
      } else if (isGroup(item)) {
        return renderGroup(item, index)
      } else if (isSeparator(item)) {
        return renderSeparator(index)
      }
      return null
    })
  }

  return (
    <ShadcnDropdownMenu open={open} onOpenChange={onOpenChange}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={cn('min-w-[160px]', contentClassName)}
      >
        {renderItems()}
      </DropdownMenuContent>
    </ShadcnDropdownMenu>
  )
}

export default DropdownMenu
