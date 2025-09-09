import type { LucideIcon } from 'lucide-react'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import type { ReactNode } from 'react'

import { baseStyles } from '@/constants/styles'

import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  icon?: LucideIcon
  iconHasBg?: boolean
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  className?: string
}

const Modal = ({
  isOpen,
  onClose,
  children,
  title,
  icon: Icon,
  iconHasBg,
  maxWidth = 'sm',
  showCloseButton = true,
  className = '',
}: ModalProps) => {
  const getMaxWidthClass = (size: string) => {
    const sizeMap: Record<string, string> = {
      sm: 'max-w-sm',
      md: 'max-w-md',
      lg: 'max-w-lg',
      xl: 'max-w-xl',
    }
    return sizeMap[size] || sizeMap.sm
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 模态框内容 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className={`rounded-3xl bg-white shadow-2xl ${getMaxWidthClass(maxWidth)} max-h-[80vh] w-full overflow-hidden ${className}`}
              initial={{ opacity: 0, scale: 0.5, y: 0, transition: { duration: 0 } }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                transition: { type: 'spring', duration: 0.3 },
              }}
              exit={{ opacity: 0, scale: 0.5, y: 0, transition: { duration: 0 } }}
            >
              {/* 标题栏 */}
              {(title || Icon || showCloseButton) && (
                <div className="flex items-center justify-between border-b border-gray-100 p-6">
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div
                        className={`${baseStyles.iconContainerLarge} ${iconHasBg ? 'bg-background text-primary' : ''}`}
                      >
                        <Icon size={20} />
                      </div>
                    )}
                    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
                  </div>
                  {showCloseButton && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      icon={X}
                      className="!h-auto !w-auto !min-w-0 rounded-full bg-gray-100 !p-2 hover:bg-gray-200"
                    >
                      {''}
                    </Button>
                  )}
                </div>
              )}

              {/* 内容区域 */}
              <div className="p-6">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}

export default Modal
