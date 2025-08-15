import { Copy, Eye, EyeOff, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Textarea from '@/components/Textarea'
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
  const [showLogs, setShowLogs] = useState(false)

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

  const handleToggleShowLogs = () => {
    setShowLogs(!showLogs)
  }

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">{title}</span>
          {showLogs ? (
            <Eye className={`h-4 w-4 text-gray-500`} onClick={handleToggleShowLogs} />
          ) : (
            <EyeOff className={`h-4 w-4 text-gray-500`} onClick={handleToggleShowLogs} />
          )}
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            icon={Copy}
            disabled={logs.length === 0}
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
            >
              清空
            </Button>
          )}
        </div>
      </div>

      {showLogs && (
        <Textarea
          readOnly
          value={logText}
          placeholder="暂无日志"
          className="h-32 text-xs font-mono"
        />
      )}
    </div>
  )
}
