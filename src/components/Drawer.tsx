import React from 'react'

import {
  Drawer as DrawerPrimitive,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'

import Button, { type ButtonProps } from './Button'

export interface DrawerProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  trigger?: React.ReactNode
  title?: string
  description?: string
  children?: React.ReactNode
  footer?: React.ReactNode
  direction?: 'top' | 'bottom' | 'left' | 'right'
  showCloseButton?: boolean
  confirmText?: string
  cancelText?: string
  onConfirm?: () => void
  onCancel?: () => void
  showCancel?: boolean
  showConfirm?: boolean
  confirmDisabled?: boolean
  cancelVariant?: ButtonProps['variant']
  confirmVariant?: ButtonProps['variant']
  contentClassName?: string
  headerClassName?: string
  footerClassName?: string
  shouldScaleBackground?: boolean
  preventScrollRestoration?: boolean
  modal?: boolean
}

export function Drawer({
  open,
  onOpenChange,
  trigger,
  title,
  description,
  children,
  footer,
  direction = 'bottom',
  showCloseButton = true,
  confirmText = '确认',
  cancelText = '取消',
  onConfirm,
  onCancel,
  showCancel = false,
  showConfirm = false,
  confirmDisabled = false,
  confirmVariant = 'default',
  cancelVariant = 'outline',
  contentClassName,
  headerClassName,
  footerClassName,
  shouldScaleBackground = true,
  preventScrollRestoration = true,
  modal = true,
}: DrawerProps) {
  const handleConfirm = () => {
    onConfirm?.()
    onOpenChange?.(false)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange?.(false)
  }

  let content = (
    <DrawerContent className={contentClassName}>
      {(title || description) && (
        <DrawerHeader className={headerClassName}>
          {title && <DrawerTitle>{title}</DrawerTitle>}
          {description && <DrawerDescription>{description}</DrawerDescription>}
        </DrawerHeader>
      )}

      {children && <div className="flex-1 overflow-auto p-4">{children}</div>}

      {(footer || showCancel || showConfirm || showCloseButton) && (
        <DrawerFooter className={footerClassName}>
          {footer || (
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
              {showConfirm && (
                <Button variant={confirmVariant} onClick={handleConfirm} disabled={confirmDisabled}>
                  {confirmText}
                </Button>
              )}
              {showCancel && (
                <DrawerClose asChild>
                  <Button variant={cancelVariant} onClick={handleCancel}>
                    {cancelText}
                  </Button>
                </DrawerClose>
              )}
              {showCloseButton && !showCancel && !showConfirm && (
                <DrawerClose asChild>
                  <Button variant="outline">关闭</Button>
                </DrawerClose>
              )}
            </div>
          )}
        </DrawerFooter>
      )}
    </DrawerContent>
  )

  if (trigger) {
    content = (
      <>
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        {content}
      </>
    )
  }

  return (
    <DrawerPrimitive
      open={open}
      onOpenChange={onOpenChange}
      direction={direction}
      shouldScaleBackground={shouldScaleBackground}
      preventScrollRestoration={preventScrollRestoration}
      modal={modal}
    >
      {content}
    </DrawerPrimitive>
  )
}

export function useDrawer() {
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

export default Drawer
