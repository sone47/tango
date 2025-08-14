import { Upload } from 'lucide-react'
import { ReactElement, useEffect, useMemo, useState } from 'react'

import AlertDialog, { useAlertDialog } from '@/components/AlertDialog'
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
  const { settings } = useSettings()
  const sendSuccessAlertDialog = useAlertDialog()
  const copyIdAlertDialog = useAlertDialog()
  const copyUrlAlertDialog = useAlertDialog()

  const [myPeerId, setMyPeerId] = useState('')
  const [connected, setConnected] = useState(false)
  const [sending, setSending] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])

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
    handleBeforeCreatePeer()

    const iceServers = (
      settings.transfer?.iceServers?.length
        ? settings.transfer.iceServers
        : [{ urls: 'stun:stun.l.google.com:19302' }]
    ) as RTCIceServer[]

    webrtcTransferService.onOffer((offer) => {
      setMyPeerId(offer.peerId)
    })

    webrtcTransferService.onConnect(() => {
      setCreateLoading(false)

      setConnected(true)
      toast.success('配对已完成，可以开始传输数据了')
    })

    webrtcTransferService.onData((chunk) => {
      const text = new TextDecoder().decode(chunk)
      if (text === 'success') {
        handleSendSuccess()
      }
    })

    webrtcTransferService.onError((err) => {
      console.error(err)
      toast.error(`配对失败: ${err.message}`)
    })

    webrtcTransferService.onClose(() => {
      toast.show({
        type: 'info',
        content: '配对已断开',
      })

      setConnected(false)
    })

    setCreateLoading(true)
    await webrtcTransferService.create({ initiator: true, iceServers })
  }

  const handleBeforeCreatePeer = () => {
    webrtcTransferService.destroy()
    setConnected(false)
    setSending(false)
  }

  const shareUrl = useMemo(() => {
    if (!myPeerId) return ''

    const url = new URL(location.href)
    url.searchParams.set('peer', myPeerId)
    return url.toString()
  }, [myPeerId])

  const handleCopyId = async (text: string) => {
    await navigator.clipboard.writeText(text)
    copyIdAlertDialog.show()
  }

  const handleCopyUrl = async (text: string) => {
    await navigator.clipboard.writeText(text)
    copyUrlAlertDialog.show()
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
    } catch (e) {
      toast.error('发送失败')
      console.error(e)

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

  const handleSendSuccess = () => {
    setSending(false)

    sendSuccessAlertDialog.show()
  }

  let content: ReactElement | null = null
  if (myPeerId) {
    content = (
      <div className="space-y-3">
        {connected ? (
          <Button
            variant="outline"
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
            <Button size="sm" className="w-full" onClick={() => handleCopyId(myPeerId)}>
              通过 ID 配对
            </Button>
            <Button
              size="sm"
              variant="secondary"
              className="w-full"
              onClick={() => handleCopyUrl(shareUrl)}
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
          variant="outline"
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
    <>
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

      <AlertDialog
        open={sendSuccessAlertDialog.isOpen}
        onOpenChange={sendSuccessAlertDialog.setIsOpen}
        title="数据已发送"
        confirmText="关闭连接"
        cancelText="继续与其他设备配对"
        onConfirm={() => {
          sendSuccessAlertDialog.hide()

          webrtcTransferService.destroy()
          setMyPeerId('')
        }}
      />

      <AlertDialog
        open={copyIdAlertDialog.isOpen}
        onOpenChange={copyIdAlertDialog.setIsOpen}
        title="配对 ID 已复制"
        description={`请将 ID （${myPeerId}）输入数据同步-接收端配对 ID 输入框，即可完成配对`}
        showCancel={false}
        onConfirm={() => {
          copyIdAlertDialog.hide()
        }}
      />

      <AlertDialog
        open={copyUrlAlertDialog.isOpen}
        onOpenChange={copyUrlAlertDialog.setIsOpen}
        title="配对链接已复制"
        description={`请将链接（${shareUrl}）发送给另一台设备，点击链接即可完成配对`}
        showCancel={false}
        onConfirm={() => {
          copyUrlAlertDialog.hide()
        }}
      />
    </>
  )
}
