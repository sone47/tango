import { clsx } from 'clsx'
import type { ReactNode } from 'react'

interface BaseTypographyProps {
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
  type?: 'default' | 'secondary' | 'success' | 'warning' | 'danger'
  disabled?: boolean
  mark?: boolean
  code?: boolean
  keyboard?: boolean
  underline?: boolean
  delete?: boolean
  strong?: boolean
  italic?: boolean
}

interface TitleProps extends BaseTypographyProps {
  level?: 1 | 2 | 3 | 4 | 5 | 6
}

interface TextProps extends BaseTypographyProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
}

interface ParagraphProps extends BaseTypographyProps {
  size?: 'sm' | 'md' | 'lg'
  ellipsis?: boolean | { rows?: number }
  copyable?: boolean
  editable?: boolean
}

const getTypeStyles = (type: BaseTypographyProps['type'] = 'default') => {
  const typeStyles = {
    default: 'text-gray-900',
    secondary: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-amber-600',
    danger: 'text-red-600',
  }
  return typeStyles[type]
}

const getDisabledStyles = (disabled?: boolean) => {
  return disabled ? 'opacity-40 cursor-not-allowed select-none' : ''
}

const getDecorationStyles = (props: BaseTypographyProps) => {
  const styles = []

  if (props.mark) styles.push('bg-yellow-200 px-1 rounded')
  if (props.code) styles.push('bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono')
  if (props.keyboard)
    styles.push(
      'bg-gray-100 border border-gray-300 text-gray-800 px-1.5 py-0.5 rounded text-sm font-mono shadow-sm'
    )
  if (props.underline) styles.push('underline')
  if (props.delete) styles.push('line-through')
  if (props.strong) styles.push('font-bold')
  if (props.italic) styles.push('italic')

  return styles.join(' ')
}

const Title = ({
  level = 1,
  children,
  className = '',
  style,
  type = 'default',
  disabled,
  ...decorationProps
}: TitleProps) => {
  const Tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

  const getLevelStyles = () => {
    const levelStyles = {
      1: 'text-4xl font-bold leading-tight tracking-tight',
      2: 'text-3xl font-bold leading-tight tracking-tight',
      3: 'text-2xl font-semibold leading-snug',
      4: 'text-xl font-semibold leading-snug',
      5: 'text-lg font-medium leading-normal',
      6: 'text-base font-medium leading-normal',
    }
    return levelStyles[level]
  }

  return (
    <Tag
      className={clsx(
        getLevelStyles(),
        getTypeStyles(type),
        getDisabledStyles(disabled),
        getDecorationStyles(decorationProps),
        className
      )}
      style={style}
    >
      {children}
    </Tag>
  )
}

const Text = ({
  size = 'base',
  weight = 'normal',
  children,
  className = '',
  style,
  type = 'default',
  disabled,
  ...decorationProps
}: TextProps) => {
  const getSizeStyles = () => {
    const sizeStyles = {
      xs: 'text-xs',
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
      xl: 'text-xl',
    }
    return sizeStyles[size]
  }

  const getWeightStyles = () => {
    const weightStyles = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    }
    return weightStyles[weight]
  }

  return (
    <span
      className={clsx(
        'leading-normal',
        getSizeStyles(),
        getWeightStyles(),
        getTypeStyles(type),
        getDisabledStyles(disabled),
        getDecorationStyles(decorationProps),
        className
      )}
      style={style}
    >
      {children}
    </span>
  )
}

const Paragraph = ({
  size = 'md',
  ellipsis,
  children,
  className = '',
  style,
  type = 'default',
  disabled,
  ...decorationProps
}: ParagraphProps) => {
  const getSizeStyles = () => {
    const sizeStyles = {
      sm: 'text-sm',
      md: 'text-md',
      lg: 'text-lg',
    }
    return sizeStyles[size]
  }

  const getEllipsisStyles = () => {
    if (!ellipsis) return ''

    if (typeof ellipsis === 'boolean') {
      return 'truncate'
    }

    if (ellipsis.rows && ellipsis.rows > 1) {
      return `line-clamp-${ellipsis.rows}`
    }

    return 'truncate'
  }

  return (
    <p
      className={clsx(
        'mb-4 leading-relaxed',
        getSizeStyles(),
        getTypeStyles(type),
        getDisabledStyles(disabled),
        getDecorationStyles(decorationProps),
        getEllipsisStyles(),
        className
      )}
      style={style}
    >
      {children}
    </p>
  )
}

interface BlockquoteProps extends BaseTypographyProps {
  cite?: string
}

const Blockquote = ({
  children,
  cite,
  className = '',
  style,
  type = 'default',
  disabled,
  ...decorationProps
}: BlockquoteProps) => {
  return (
    <blockquote
      className={clsx(
        'border-l-4 border-gray-300 pl-4 italic text-gray-700 mb-4',
        getTypeStyles(type),
        getDisabledStyles(disabled),
        getDecorationStyles(decorationProps),
        className
      )}
      style={style}
      cite={cite}
    >
      {children}
    </blockquote>
  )
}

interface LinkProps extends BaseTypographyProps {
  href?: string
  target?: string
  rel?: string
}

const Link = ({
  href,
  target,
  rel,
  children,
  className = '',
  style,
  type = 'default',
  disabled,
  ...decorationProps
}: LinkProps) => {
  const handleClick = (e: React.MouseEvent) => {
    if (disabled) {
      e.preventDefault()
    }
  }

  return (
    <a
      href={href}
      target={target}
      rel={rel}
      className={clsx(
        'text-blue-600 hover:text-blue-800 underline transition-colors cursor-pointer',
        getTypeStyles(type),
        getDisabledStyles(disabled),
        getDecorationStyles(decorationProps),
        className
      )}
      style={style}
      onClick={handleClick}
    >
      {children}
    </a>
  )
}

const Typography = ({
  children,
  className = '',
  style,
}: {
  children?: ReactNode
  className?: string
  style?: React.CSSProperties
}) => {
  return (
    <div className={className} style={style}>
      {children}
    </div>
  )
}

Typography.Title = Title
Typography.Text = Text
Typography.Paragraph = Paragraph
Typography.Blockquote = Blockquote
Typography.Link = Link

export default Typography
export { Blockquote, Link, Paragraph, Text, Title }
export type { BlockquoteProps, LinkProps, ParagraphProps, TextProps, TitleProps }
