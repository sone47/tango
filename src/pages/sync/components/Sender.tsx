import { Upload } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'

import Button from '@/components/Button'
import Card from '@/components/Card'
import toast from '@/components/Toast'
import Typography from '@/components/Typography'
import { Separator } from '@/components/ui/separator'
import { useSettings } from '@/hooks/useSettings'
import { dataSyncService } from '@/services/dataSyncService'
import { type LogEntry, webrtcTransferService } from '@/services/webrtcTransferService'

import DebugLogger from './DebugLogger'

export default function Sender() {
  const [myPeerId, setMyPeerId] = useState('')
  const [connected, setConnected] = useState(false)
  const [sending, setSending] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const { settings } = useSettings()

  useEffect(() => {
    clearLogs()

    const handleLog = (log: LogEntry) => {
      setLogs((prev) => [...prev, log])
    }

    webrtcTransferService.onLog(handleLog)

    return () => {
      webrtcTransferService.onLog()
    }
  }, [])

  const clearLogs = () => {
    setLogs([])
    webrtcTransferService.clearLogs()
  }

  const createPeer = async () => {
    webrtcTransferService.destroy()

    const iceServers = (
      settings.transfer?.iceServers?.length
        ? settings.transfer.iceServers
        : [{ urls: 'stun:stun.l.google.com:19302' }]
    ) as RTCIceServer[]

    webrtcTransferService.onOffer((offer) => {
      setMyPeerId(offer.peerId)
    })

    webrtcTransferService.onConnect(() => {
      setConnected(true)
      toast.success('配对已完成，可以开始传输数据了')
    })

    webrtcTransferService.onError((err) => {
      console.error(err)
      toast.error(`配对失败: ${err.message}`)
    })

    webrtcTransferService.onClose(() => {
      setConnected(false)
    })

    setCreateLoading(true)
    await webrtcTransferService.create({ initiator: true, iceServers })
  }

  const shareUrl = useMemo(() => {
    if (!myPeerId) return ''

    const url = new URL(location.href)
    url.searchParams.set('peer', myPeerId)
    return url.toString()
  }, [myPeerId])

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
    toast.success('已复制')
  }

  const handleSendAll = async () => {
    if (!webrtcTransferService.isConnected()) {
      toast.error('未完成配对')
      return
    }

    try {
      setSending(true)

      const payload = await dataSyncService.exportAll()
      const json = JSON.stringify({ type: 'payload', payload })
      const bytes = new TextEncoder().encode(json)
      webrtcTransferService.send(bytes)

      toast.success('已发送')
    } catch (e) {
      toast.error('发送失败')
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  const handleExportJSON = async () => {
    setExportLoading(true)

    try {
      const payload = await dataSyncService.exportAll()
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tango-backup-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('导出失败')
      console.error(error)
    } finally {
      setExportLoading(false)
    }
  }

  let content: ReactElement | null = null
  if (myPeerId) {
    content = (
      <div className="space-y-3">
        {connected ? (
          <Button
            variant="primary"
            size="sm"
            icon={Upload}
            loading={sending}
            onClick={handleSendAll}
            className="w-full"
          >
            发送全部词包和学习进度
          </Button>
        ) : (
          <>
            <Button size="sm" className="w-full" onClick={() => handleCopy(myPeerId)}>
              通过 ID 配对
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => handleCopy(shareUrl)}
            >
              通过链接配对
            </Button>
            <div className="text-sm text-gray-600">等待对方配对...</div>
          </>
        )}
      </div>
    )
  } else {
    content = (
      <>
        <Button
          className="w-full"
          variant="primary"
          size="sm"
          onClick={createPeer}
          loading={createLoading}
        >
          {createLoading ? '生成配对信息中...' : '开始配对'}
        </Button>
        <Typography.Text type="secondary" size="xs">
          与其他设备配对，将全部词包和学习进度同步至其他设备
        </Typography.Text>
      </>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="space-y-2">
        {content}
        <Separator className="my-4"></Separator>
        <DebugLogger logs={logs} onClear={clearLogs} title="传输日志" />
      </Card>

      <Card contentClassName="flex flex-col gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={Upload}
          onClick={handleExportJSON}
          className="w-full"
          loading={exportLoading}
        >
          导出数据文件
        </Button>
        <Typography.Text type="secondary" size="xs">
          当配对功能无法使用时，请使用数据导出
        </Typography.Text>
      </Card>
    </div>
  )
}
