import type { LucideIcon } from 'lucide-react'
import { forwardRef } from 'react'

import { Input as ShadcnInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  label?: string
  description?: string
  error?: string
  icon?: LucideIcon
  iconPosition?: 'left' | 'right'
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost'
  containerClassName?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      containerClassName,
      label,
      description,
      error,
      icon: Icon,
      iconPosition = 'left',
      size = 'md',
      variant = 'default',
      ...props
    },
    ref
  ) => {
    const getSizeStyles = () => {
      const sizes = {
        sm: 'h-8 px-2 text-xs',
        md: 'h-9 px-3 text-sm',
        lg: 'h-10 px-4 text-base',
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

    const getIconSize = () => {
      const iconSizes = {
        sm: 14,
        md: 16,
        lg: 18,
      }
      return iconSizes[size]
    }

    const inputElement = (
      <div className="relative">
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon size={getIconSize()} />
          </div>
        )}
        <ShadcnInput
          ref={ref}
          className={cn(
            getSizeStyles(),
            getVariantStyles(),
            Icon && iconPosition === 'left' && 'pl-9',
            Icon && iconPosition === 'right' && 'pr-9',
            error && 'border-destructive focus-visible:border-destructive',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={description || error ? `${props.id || 'input'}-description` : undefined}
          {...props}
        />
        {Icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            <Icon size={getIconSize()} />
          </div>
        )}
      </div>
    )

    if (label || description || error) {
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
          {inputElement}
          {(description || error) && (
            <p
              id={`${props.id || 'input'}-description`}
              className={cn('text-xs', error ? 'text-destructive' : 'text-muted-foreground')}
            >
              {error || description}
            </p>
          )}
        </div>
      )
    }

    return inputElement
  }
)

Input.displayName = 'Input'

export default Input
