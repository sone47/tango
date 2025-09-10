import React from 'react'

import {
  Dialog as DialogPrimitive,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

import Button from './Button'

export interface DialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title?: React.ReactNode
  description?: React.ReactNode
  children?: React.ReactNode
  showCloseButton?: boolean
  footer?: React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  showCancel?: boolean
  showConfirm?: boolean
  confirmDisabled?: boolean
  confirmVariant?:
    | 'default'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost'
    | 'link'
    | 'primary'
    | 'danger'
  contentClassName?: string
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  openAutoFocus?: boolean
  closeOnMaskClick?: boolean
}

export function Dialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  showCloseButton = true,
  footer,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  showCancel = false,
  showConfirm = false,
  confirmDisabled = false,
  confirmVariant = 'default',
  contentClassName,
  maxWidth = 'lg',
  openAutoFocus = true,
  closeOnMaskClick = true,
}: DialogProps) {
  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange?.(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange?.(false)
  }

  const getMaxWidthClass = () => {
    const widthMap = {
      sm: 'sm:max-w-sm',
      md: 'sm:max-w-md',
      lg: 'sm:max-w-lg',
      xl: 'sm:max-w-xl',
      '2xl': 'sm:max-w-2xl',
    }
    return widthMap[maxWidth] || widthMap.lg
  }

  const content = (
    <DialogContent
      className={`${getMaxWidthClass()} ${contentClassName || ''}`}
      showCloseButton={showCloseButton}
      onOpenAutoFocus={openAutoFocus ? undefined : (e) => e.preventDefault()}
      onPointerDownOutside={closeOnMaskClick ? undefined : (e) => e.preventDefault()}
    >
      {(title || description) && (
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
      )}

      {children && <div>{children}</div>}

      {(footer || showCancel || showConfirm) && (
        <DialogFooter>
          {footer || (
            <div className="flex gap-2">
              {showConfirm && (
                <Button
                  variant={confirmVariant}
                  onClick={handleConfirm}
                  disabled={confirmDisabled}
                  className="flex-1"
                >
                  {confirmText}
                </Button>
              )}
              {showCancel && (
                <DialogClose asChild className="flex-1">
                  <Button variant="outline" onClick={handleCancel}>
                    {cancelText}
                  </Button>
                </DialogClose>
              )}
            </div>
          )}
        </DialogFooter>
      )}
    </DialogContent>
  )

  if (trigger) {
    return (
      <DialogPrimitive open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        {content}
      </DialogPrimitive>
    )
  }

  return (
    <DialogPrimitive open={open} onOpenChange={onOpenChange}>
      {content}
    </DialogPrimitive>
  )
}

export function useDialog() {
  const [isOpen, setIsOpen] = React.useState(false)

  const open = React.useCallback(() => setIsOpen(true), [])
  const close = React.useCallback(() => setIsOpen(false), [])
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), [])

  return {
    isOpen,
    open,
    close,
    toggle,
    setIsOpen,
  }
}

export default Dialog
