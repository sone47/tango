import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle, Loader2, XCircle } from 'lucide-react'
import { createContext, ReactNode, useCallback, useState } from 'react'

export interface ToastOptions {
  type?: 'success' | 'error' | 'loading' | 'info'
  duration?: number
  content: string
}

interface ToastItem extends ToastOptions {
  id: string
  type: 'success' | 'error' | 'loading' | 'info'
}

interface ToastContextValue {
  show: (options: ToastOptions) => void
  success: (content: string, duration?: number) => void
  error: (content: string, duration?: number) => void
  loading: (content: string) => () => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

let globalToastRef: ToastContextValue | null = null

const ToastComponent = ({ toast, onClose }: { toast: ToastItem; onClose: () => void }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} className="text-green-600" />
      case 'error':
        return <XCircle size={20} className="text-red-600" />
      case 'loading':
        return <Loader2 size={20} className="text-blue-600 animate-spin" />
      default:
        return null
    }
  }

  const getBackgroundColor = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'loading':
        return 'bg-blue-50 border-blue-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
      className={`fixed top-20 left-1/2 transform -translate-x-1/2 z-50 ${getBackgroundColor()} border rounded-2xl px-4 py-3 shadow-lg backdrop-blur-sm flex items-center gap-2 min-w-[100px] max-w-[300px]`}
      onClick={toast.type !== 'loading' ? onClose : undefined}
    >
      {getIcon()}
      <span className="text-sm font-medium text-gray-800 flex-1">{toast.content}</span>
    </motion.div>
  )
}

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const show = useCallback(
    (options: ToastOptions) => {
      const id = Date.now().toString()
      const toast: ToastItem = {
        id,
        type: options.type || 'success',
        content: options.content,
        duration: options.duration,
      }

      setToasts((prev) => [...prev, toast])

      // 自动移除 toast（除了 loading 类型）
      if (toast.type !== 'loading') {
        const duration = toast.duration || (toast.type === 'error' ? 3000 : 2000)
        setTimeout(() => removeToast(id), duration)
      }

      return id
    },
    [removeToast]
  )

  const success = useCallback(
    (content: string, duration?: number) => {
      show({ type: 'success', content, duration })
    },
    [show]
  )

  const error = useCallback(
    (content: string, duration?: number) => {
      show({ type: 'error', content, duration })
    },
    [show]
  )

  const loading = useCallback(
    (content: string) => {
      const id = show({ type: 'loading', content })
      return () => removeToast(id)
    },
    [show, removeToast]
  )

  const contextValue: ToastContextValue = {
    show,
    success,
    error,
    loading,
  }

  globalToastRef = contextValue

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastComponent key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </ToastContext.Provider>
  )
}

export default {
  success: (content: string, duration?: number) => {
    globalToastRef?.success(content, duration)
  },
  error: (content: string, duration?: number) => {
    globalToastRef?.error(content, duration)
  },
  loading: (content: string) => {
    return globalToastRef?.loading(content) || (() => {})
  },
  show: (options: ToastOptions) => {
    globalToastRef?.show(options)
  },
}
