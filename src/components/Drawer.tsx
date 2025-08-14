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

import Button from './Button'

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

  const content = (
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
              {showCancel && (
                <DrawerClose asChild>
                  <Button variant="outline" onClick={handleCancel}>
                    {cancelText}
                  </Button>
                </DrawerClose>
              )}
              {showConfirm && (
                <Button variant={confirmVariant} onClick={handleConfirm} disabled={confirmDisabled}>
                  {confirmText}
                </Button>
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
    return (
      <DrawerPrimitive
        open={open}
        onOpenChange={onOpenChange}
        direction={direction}
        shouldScaleBackground={shouldScaleBackground}
        preventScrollRestoration={preventScrollRestoration}
        modal={modal}
      >
        <DrawerTrigger asChild>{trigger}</DrawerTrigger>
        {content}
      </DrawerPrimitive>
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
