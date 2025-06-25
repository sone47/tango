import { AnimatePresence, motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

import { baseStyles, colors } from '@/constants/styles'

import Button from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
  icon?: LucideIcon
  iconColor?: keyof typeof colors.icon
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
  iconColor = 'blue',
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* 模态框内容 */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              className={`bg-white rounded-3xl shadow-2xl ${getMaxWidthClass(maxWidth)} w-full max-h-[80vh] overflow-hidden ${className}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              {/* 标题栏 */}
              {(title || Icon || showCloseButton) && (
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    {Icon && (
                      <div className={`${baseStyles.iconContainer} ${colors.icon[iconColor]}`}>
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
                      className="!p-2 !min-w-0 !w-auto !h-auto bg-gray-100 rounded-full hover:bg-gray-200"
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
