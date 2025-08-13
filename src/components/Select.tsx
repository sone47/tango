import type { LucideIcon } from 'lucide-react'
import React from 'react'

import {
  Select as UISelect,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface SelectOption {
  value: string
  label: React.ReactNode
  icon?: LucideIcon
  disabled?: boolean
}

export interface SelectGroup {
  label?: string
  options: SelectOption[]
}

export interface SelectProps {
  // 基础属性
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  required?: boolean

  // 数据
  options?: SelectOption[]
  groups?: SelectGroup[]

  // 样式
  className?: string
  triggerClassName?: string
  contentClassName?: string
  size?: 'sm' | 'default'
  fullWidth?: boolean

  // 状态
  error?: boolean
  errorMessage?: string

  // 显示
  name?: string
  'data-testid'?: string
}

const Select: React.FC<SelectProps> = ({
  value,
  defaultValue,
  onValueChange,
  placeholder = '请选择...',
  disabled = false,
  required = false,
  options = [],
  groups = [],
  className,
  triggerClassName,
  contentClassName,
  size = 'default',
  fullWidth = false,
  error = false,
  errorMessage,
  name,
  'data-testid': testId,
}) => {
  const hasGroups = groups.length > 0
  const allOptions = hasGroups ? groups.flatMap((group) => group.options) : options

  const renderOption = (option: SelectOption) => {
    const Icon = option.icon

    return (
      <SelectItem key={option.value} value={option.value} disabled={option.disabled}>
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
              <Icon size={14} className="text-gray-600" />
            </div>
          )}
          <span>{option.label}</span>
        </div>
      </SelectItem>
    )
  }

  const renderContent = () => {
    if (hasGroups) {
      return groups.map((group, groupIndex) => (
        <React.Fragment key={groupIndex}>
          {group.label && <SelectLabel>{group.label}</SelectLabel>}
          <SelectGroup>{group.options.map(renderOption)}</SelectGroup>
          {groupIndex < groups.length - 1 && <SelectSeparator />}
        </React.Fragment>
      ))
    }

    return options.map(renderOption)
  }

  const getSelectedOption = () => {
    const currentValue = value || defaultValue
    if (!currentValue) return null

    return allOptions.find((option) => option.value === currentValue)
  }

  const selectedOption = getSelectedOption()
  const SelectedIcon = selectedOption?.icon

  return (
    <div className={cn('relative', fullWidth && 'w-full', className)}>
      <UISelect
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        required={required}
        name={name}
        data-testid={testId}
      >
        <SelectTrigger
          className={cn(
            'text-left',
            fullWidth && 'w-full',
            error && 'border-red-500 focus-visible:border-red-500 focus-visible:ring-red-500/20',
            triggerClassName
          )}
          size={size}
        >
          <SelectValue placeholder={placeholder}>
            {selectedOption && (
              <div className="flex items-center gap-2">
                {SelectedIcon && (
                  <div className="flex-shrink-0 w-4 h-4 flex items-center justify-center">
                    <SelectedIcon size={14} className="text-gray-600" />
                  </div>
                )}
                <span>{selectedOption.label}</span>
              </div>
            )}
          </SelectValue>
        </SelectTrigger>

        <SelectContent className={cn('min-w-[--radix-select-trigger-width]', contentClassName)}>
          {renderContent()}
        </SelectContent>
      </UISelect>

      {error && errorMessage && <p className="mt-1 text-xs text-red-600">{errorMessage}</p>}
    </div>
  )
}

export default Select
