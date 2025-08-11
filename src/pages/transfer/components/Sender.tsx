import { Copy, Upload } from 'lucide-react'
import { ReactElement, useMemo, useState } from 'react'

import Button from '@/components/Button'
import Input from '@/components/Input'
import toast from '@/components/Toast'
import Typography from '@/components/Typography'
import { Separator } from '@/components/ui/separator'
import { useSettings } from '@/hooks/useSettings'
import { dataSyncService } from '@/services/dataSyncService'
import { webrtcTransferService } from '@/services/webrtcTransferService'

export default function Sender() {
  const [myPeerId, setMyPeerId] = useState('')
  const [connected, setConnected] = useState(false)
  const [sending, setSending] = useState(false)
  const [progressMsg, setProgressMsg] = useState('')
  const [exportLoading, setExportLoading] = useState(false)
  const { settings } = useSettings()

  const createPeer = () => {
    webrtcTransferService.destroy()

    const iceServers = (
      settings.transfer?.iceServers?.length
        ? settings.transfer.iceServers
        : [{ urls: 'stun:stun.l.google.com:19302' }]
    ) as RTCIceServer[]

    webrtcTransferService.create({ initiator: true, iceServers })

    webrtcTransferService.onOffer((offer) => {
      setMyPeerId(offer.peerId)
    })

    webrtcTransferService.onConnect(() => {
      setConnected(true)
      toast.success('连接成功')
    })

    webrtcTransferService.onError((err) => {
      console.error(err)
      toast.error(`连接失败: ${err.message}`)
    })

    webrtcTransferService.onClose(() => {
      setConnected(false)
      setProgressMsg('连接已断开')
    })
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
      toast.error('未连接')
      return
    }

    try {
      setSending(true)
      setProgressMsg('正在打包数据...')
      const payload = await dataSyncService.exportAll()
      const json = JSON.stringify({ type: 'payload', payload })
      const bytes = new TextEncoder().encode(json)
      webrtcTransferService.send(bytes)
      setProgressMsg('发送完成')
      toast.success('发送完成')
    } catch (error) {
      setProgressMsg('发送失败')
      toast.error('发送失败')
      console.error(error)
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
      <>
        <div className="text-sm text-gray-600">我的配对 ID</div>
        <div className="flex gap-2">
          <Input variant="ghost" size="sm" className="flex-1" value={myPeerId} readOnly />
          <Button size="sm" onClick={() => handleCopy(myPeerId)} icon={Copy}>
            复制
          </Button>
        </div>
        <div className="text-sm text-gray-600">分享链接给对方</div>
        <div className="flex gap-2">
          <Input variant="ghost" size="sm" className="flex-1" value={shareUrl} readOnly />
          <Button size="sm" onClick={() => handleCopy(shareUrl)} icon={Copy}>
            复制
          </Button>
        </div>
        {connected ? (
          <div className="space-y-2">
            <Button
              variant="primary"
              icon={Upload}
              loading={sending}
              onClick={handleSendAll}
              className="w-full"
            >
              发送全部数据
            </Button>
          </div>
        ) : (
          <div className="text-sm text-gray-600">等待对方连接...</div>
        )}
        {progressMsg && <div className="text-sm text-gray-600">{progressMsg}</div>}
      </>
    )
  } else {
    content = (
      <Button className="w-full" variant="primary" size="sm" onClick={createPeer}>
        开始配对
      </Button>
    )
  }

  return (
    <div className="space-y-2">
      {content}

      <Separator className="my-4"></Separator>

      <div className="flex flex-col gap-2">
        <Typography.Text type="secondary" size="sm">
          当配对功能无法使用时，请使用数据导出
        </Typography.Text>
        <Button
          variant="secondary"
          icon={Upload}
          onClick={handleExportJSON}
          className="w-full"
          loading={exportLoading}
        >
          导出数据文件
        </Button>
      </div>
    </div>
  )
}
