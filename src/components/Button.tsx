import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

import { Button as ShadcnButton } from './ui/button'

export interface ButtonProps extends React.ComponentProps<'button'> {
  children?: ReactNode
  variant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'primary'
    | 'danger'
  size?: 'default' | 'sm' | 'lg' | 'icon' | 'xs' | 'md' | 'xl'
  icon?: LucideIcon
  loading?: boolean
  fullWidth?: boolean
  asChild?: boolean
}

const Button = ({
  children,
  variant = 'default',
  size = 'default',
  icon: Icon,
  loading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  asChild = false,
  onClick,
  ...props
}: ButtonProps) => {
  const mapVariant = (v: ButtonProps['variant']) => {
    const variantMap = {
      primary: 'default',
      danger: 'destructive',
      secondary: 'secondary',
      ghost: 'ghost',
      default: 'default',
      destructive: 'destructive',
      outline: 'outline',
      link: 'link',
    } as const
    return variantMap[v as keyof typeof variantMap] || 'default'
  }

  // 映射自定义尺寸到 shadcn 尺寸
  const mapSize = (s: ButtonProps['size']) => {
    const sizeMap = {
      xs: 'sm',
      sm: 'sm',
      md: 'default',
      lg: 'lg',
      xl: 'lg',
      default: 'default',
      icon: 'icon',
    } as const
    return sizeMap[s as keyof typeof sizeMap] || 'default'
  }

  const getIconSize = () => {
    const iconSizes = {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 20,
      xl: 24,
      default: 16,
      icon: 16,
    }
    return iconSizes[size as keyof typeof iconSizes] || 16
  }

  const getExtraStyles = () => {
    if (size === 'xs') return 'h-7 px-2 text-xs'
    if (size === 'xl') return 'h-12 px-8 text-lg'
    return ''
  }

  const isDisabled = disabled || loading

  return (
    <ShadcnButton
      variant={mapVariant(variant)}
      size={mapSize(size)}
      disabled={isDisabled}
      onClick={(event) => onClick?.(event)}
      asChild={asChild}
      className={cn(getExtraStyles(), fullWidth && 'w-full', 'gap-2', className)}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {Icon && !loading && <Icon size={getIconSize()} />}
      {children}
    </ShadcnButton>
  )
}

export default Button
