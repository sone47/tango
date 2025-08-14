import React from 'react'

import { ToggleGroup as ToggleGroupPrimitive, ToggleGroupItem } from '@/components/ui/toggle-group'

export interface ToggleOption {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
  className?: string
}

export interface ToggleGroupProps {
  options: ToggleOption[]
  value?: string
  values?: string[]
  onValueChange?: (value: string) => void
  onValuesChange?: (values: string[]) => void
  type?: 'single' | 'multiple'
  size?: 'default' | 'sm' | 'lg'
  variant?: 'default' | 'outline'
  disabled?: boolean
  className?: string
  allowDeselect?: boolean
}

export function ToggleGroup({
  options,
  value,
  values,
  onValueChange,
  onValuesChange,
  type = 'single',
  size = 'default',
  variant = 'default',
  disabled = false,
  className,
  allowDeselect = false,
}: ToggleGroupProps) {
  const handleSingleValueChange = (newValue: string) => {
    if (type === 'single') {
      if (allowDeselect && value === newValue) {
        onValueChange?.('')
      } else {
        onValueChange?.(newValue)
      }
    }
  }

  const handleMultipleValueChange = (newValues: string[]) => {
    if (type === 'multiple') {
      onValuesChange?.(newValues)
    }
  }

  if (type === 'single') {
    return (
      <ToggleGroupPrimitive
        type="single"
        value={value}
        onValueChange={handleSingleValueChange}
        size={size}
        variant={variant}
        disabled={disabled}
        className={className}
      >
        {options.map((option) => (
          <ToggleGroupItem
            key={option.value}
            value={option.value}
            disabled={disabled || option.disabled}
            className={option.className}
            aria-label={option.label}
          >
            {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroupPrimitive>
    )
  }

  return (
    <ToggleGroupPrimitive
      type="multiple"
      value={values}
      onValueChange={handleMultipleValueChange}
      size={size}
      variant={variant}
      disabled={disabled}
      className={className}
    >
      {options.map((option) => (
        <ToggleGroupItem
          key={option.value}
          value={option.value}
          disabled={disabled || option.disabled}
          className={option.className}
          aria-label={option.label}
        >
          {option.icon && <span className="flex-shrink-0">{option.icon}</span>}
          <span>{option.label}</span>
        </ToggleGroupItem>
      ))}
    </ToggleGroupPrimitive>
  )
}

export function useToggleGroup(initialValue?: string) {
  const [value, setValue] = React.useState(initialValue || '')

  const reset = React.useCallback(() => setValue(''), [])
  const isSelected = React.useCallback((optionValue: string) => value === optionValue, [value])

  return {
    value,
    setValue,
    reset,
    isSelected,
  }
}

export function useMultiToggleGroup(initialValues?: string[]) {
  const [values, setValues] = React.useState<string[]>(initialValues || [])

  const reset = React.useCallback(() => setValues([]), [])
  const isSelected = React.useCallback(
    (optionValue: string) => values.includes(optionValue),
    [values]
  )
  const toggle = React.useCallback((optionValue: string) => {
    setValues((prev) =>
      prev.includes(optionValue) ? prev.filter((v) => v !== optionValue) : [...prev, optionValue]
    )
  }, [])
  const select = React.useCallback((optionValue: string) => {
    setValues((prev) => (prev.includes(optionValue) ? prev : [...prev, optionValue]))
  }, [])
  const deselect = React.useCallback((optionValue: string) => {
    setValues((prev) => prev.filter((v) => v !== optionValue))
  }, [])

  return {
    values,
    setValues,
    reset,
    isSelected,
    toggle,
    select,
    deselect,
  }
}

export default ToggleGroup
