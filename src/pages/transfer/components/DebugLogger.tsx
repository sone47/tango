import { Copy, Trash2 } from 'lucide-react'

import Button from '@/components/Button'
import toast from '@/components/Toast'
import { Textarea } from '@/components/ui/textarea'
import { type LogEntry } from '@/services/webrtcTransferService'
import { DateUtils } from '@/utils/date'

interface DebugLoggerProps {
  logs: LogEntry[]
  onClear?: () => void
  title?: string
  className?: string
}

export default function DebugLogger({
  logs,
  onClear,
  title = '调试日志',
  className = '',
}: DebugLoggerProps) {
  const formatTime = (date: Date) => {
    return DateUtils.format(date, 'HH:mm:ss')
  }

  const logText = logs
    .map((log) => {
      const time = formatTime(log.timestamp)
      return `[${time}] ${log.message}`
    })
    .join('\n')

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(logText)
      toast.success('日志已复制到剪贴板')
    } catch {
      toast.error('复制失败')
    }
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">{title}</span>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            icon={Copy}
            disabled={logs.length === 0}
            className="text-gray-600"
          >
            复制
          </Button>
          {onClear && (
            <Button
              size="sm"
              variant="ghost"
              onClick={onClear}
              icon={Trash2}
              disabled={logs.length === 0}
              className="text-gray-600"
            >
              清空
            </Button>
          )}
        </div>
      </div>

      <Textarea
        readOnly
        value={logText}
        placeholder="暂无日志"
        className="h-32 text-xs font-mono"
      />
    </div>
  )
}
