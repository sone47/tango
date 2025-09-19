import { Loader2 } from 'lucide-react'
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
  title: string | React.ReactNode
  description?: string | React.ReactNode
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  showCancel?: boolean
  confirmVariant?: 'default' | 'destructive'
  confirmDisabled?: boolean
  children?: React.ReactNode
  loading?: boolean
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
  loading = false,
}: AlertDialogProps) {
  const handleConfirm = () => {
    onConfirm?.()
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
          disabled={confirmDisabled || loading}
          className={
            confirmVariant === 'destructive' ? 'bg-destructive hover:bg-destructive/90' : undefined
          }
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
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
