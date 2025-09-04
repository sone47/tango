import { forwardRef } from 'react'

import { Input as ShadcnInput } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface InputProps extends Omit<React.ComponentProps<'input'>, 'size'> {
  label?: string
  description?: string
  error?: string
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
        ghost: 'border-0 bg-gray-100 focus-visible:bg-white',
      }
      return variants[variant]
    }

    const inputElement = (
      <ShadcnInput
        ref={ref}
        className={cn(
          getSizeStyles(),
          getVariantStyles(),
          error && 'border-destructive focus-visible:border-destructive',
          className
        )}
        aria-invalid={!!error}
        aria-describedby={description || error ? `${props.id || 'input'}-description` : undefined}
        {...props}
      />
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
