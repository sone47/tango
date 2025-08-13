import React from 'react'

import {
  AlertDialog as AlertDialogPrimitive,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export interface AlertDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  showCancel?: boolean
  confirmVariant?: 'default' | 'destructive'
  confirmDisabled?: boolean
  children?: React.ReactNode
}

export function AlertDialog({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  showCancel = true,
  confirmVariant = 'default',
  confirmDisabled = false,
  children,
}: AlertDialogProps) {
  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange?.(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange?.(false)
  }

  const content = (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        {children ? (
          children
        ) : description ? (
          <AlertDialogDescription>{description}</AlertDialogDescription>
        ) : null}
      </AlertDialogHeader>
      <AlertDialogFooter>
        {showCancel && <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>}
        <AlertDialogAction
          onClick={handleConfirm}
          disabled={confirmDisabled}
          className={
            confirmVariant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : undefined
          }
        >
          {confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )

  if (trigger) {
    return (
      <AlertDialogPrimitive open={open} onOpenChange={onOpenChange}>
        <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
        {content}
      </AlertDialogPrimitive>
    )
  }

  return (
    <AlertDialogPrimitive open={open} onOpenChange={onOpenChange}>
      {content}
    </AlertDialogPrimitive>
  )
}

export function useAlertDialog() {
  const [isOpen, setIsOpen] = React.useState(false)

  const show = React.useCallback(() => setIsOpen(true), [])
  const hide = React.useCallback(() => setIsOpen(false), [])

  return {
    isOpen,
    show,
    hide,
    setIsOpen,
  }
}

export default AlertDialog
