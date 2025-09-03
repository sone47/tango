import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react'

import { Textarea as ShadcnTextarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

export interface TextareaProps extends Omit<React.ComponentProps<'textarea'>, 'size'> {
  label?: string
  description?: string
  error?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost'
  containerClassName?: string
  showCount?: boolean
  maxLength?: number
  autoResize?: boolean
  minHeight?: number
  maxHeight?: number
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      containerClassName,
      label,
      description,
      error,
      size = 'md',
      variant = 'default',
      showCount = false,
      maxLength,
      autoResize = false,
      minHeight = 64,
      maxHeight = 200,
      resize = 'vertical',
      value,
      onChange,
      ...props
    },
    ref
  ) => {
    const [currentValue, setCurrentValue] = useState(value || '')
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const combinedRef = ref || textareaRef

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const newValue = e.target.value

        if (maxLength && newValue.length > maxLength) {
          return
        }

        setCurrentValue(newValue)
        onChange?.(e)
      },
      [maxLength, onChange]
    )

    const adjustHeight = useCallback(() => {
      if (!autoResize) return

      const textarea = (combinedRef as React.RefObject<HTMLTextAreaElement>)?.current
      if (!textarea) return

      textarea.style.height = 'auto'

      const scrollHeight = textarea.scrollHeight
      const newHeight = Math.min(Math.max(scrollHeight, minHeight), maxHeight)

      textarea.style.height = `${newHeight}px`
    }, [autoResize, minHeight, maxHeight, combinedRef])

    useEffect(() => {
      adjustHeight()
    }, [currentValue, adjustHeight])

    // 监听外部 value 变化
    useEffect(() => {
      if (value !== undefined && value !== currentValue) {
        setCurrentValue(value)
      }
    }, [value, currentValue])

    const getSizeStyles = () => {
      const sizes = {
        sm: 'min-h-12 px-2 py-1.5 text-xs',
        md: 'min-h-16 px-3 py-2 text-sm',
        lg: 'min-h-20 px-4 py-3 text-base',
      }
      return sizes[size]
    }

    const getVariantStyles = () => {
      const variants = {
        default: '',
        ghost: 'border-0 bg-gray-100 focus-visible:bg-white focus-visible:ring-2',
      }
      return variants[variant]
    }

    const getResizeStyles = () => {
      const resizeMap = {
        none: 'resize-none',
        vertical: 'resize-y',
        horizontal: 'resize-x',
        both: 'resize',
      }
      return resizeMap[resize]
    }

    const textareaElement = (
      <div className="relative">
        <ShadcnTextarea
          ref={combinedRef}
          className={cn(
            getSizeStyles(),
            getVariantStyles(),
            getResizeStyles(),
            autoResize && 'overflow-hidden',
            error && 'border-destructive focus-visible:border-destructive',
            className
          )}
          style={
            autoResize
              ? {
                  minHeight: `${minHeight}px`,
                  maxHeight: `${maxHeight}px`,
                  height: 'auto',
                }
              : undefined
          }
          aria-invalid={!!error}
          aria-describedby={
            description || error || showCount ? `${props.id || 'textarea'}-description` : undefined
          }
          value={currentValue}
          onChange={handleChange}
          maxLength={maxLength}
          {...props}
        />

        {showCount && maxLength && (
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground bg-card/80 px-1 rounded">
            {String(currentValue).length}/{maxLength}
          </div>
        )}
      </div>
    )

    if (label || description || error || (showCount && !maxLength)) {
      return (
        <div className={cn('space-y-2', containerClassName)}>
          {label && (
            <label
              htmlFor={props.id}
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {label}
            </label>
          )}

          {textareaElement}

          <div className="flex justify-between items-start">
            <div className="flex-1">
              {(description || error) && (
                <p
                  id={`${props.id || 'textarea'}-description`}
                  className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}
                >
                  {error || description}
                </p>
              )}
            </div>

            {showCount && !maxLength && (
              <p className="text-xs text-muted-foreground ml-2">
                {String(currentValue).length} 字符
              </p>
            )}
          </div>
        </div>
      )
    }

    return textareaElement
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
