import { Download } from 'lucide-react'
import { useEffect, useState } from 'react'

import Button from '@/components/Button'
import Input from '@/components/Input'
import toast from '@/components/Toast'
import { useSettings } from '@/hooks/useSettings'
import { type DataSyncPayload, dataSyncService } from '@/services/dataSyncService'
import { webrtcTransferService } from '@/services/webrtcTransferService'

interface ReceiverProps {
  onProgressChange: (message: string) => void
}

export default function Receiver({ onProgressChange }: ReceiverProps) {
  const [remotePeerId, setRemotePeerId] = useState('')
  const [connected, setConnected] = useState(false)
  const [receiving, setReceiving] = useState(false)
  const { settings } = useSettings()

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const peerId = urlParams.get('peer')
    if (peerId) {
      setRemotePeerId(decodeURIComponent(peerId))
    }
  }, [])

  const createPeer = () => {
    webrtcTransferService.destroy()
    const iceServers = (
      settings.transfer?.iceServers?.length
        ? settings.transfer.iceServers
        : [{ urls: 'stun:stun.l.google.com:19302' }]
    ) as RTCIceServer[]

    webrtcTransferService.create({ initiator: false, iceServers })

    webrtcTransferService.onConnect(() => {
      setConnected(true)
      toast.success('连接成功')
    })

    webrtcTransferService.onData(async (chunk) => {
      try {
        const text = new TextDecoder().decode(chunk)
        const message = JSON.parse(text)
        if (message.type === 'payload') {
          setReceiving(true)
          onProgressChange('正在导入...')
          const payload = message.payload as DataSyncPayload
          const strategy = settings.transfer?.importStrategy || 'overwrite'
          if (strategy === 'overwrite') {
            await dataSyncService.importAllOverwrite(payload)
          } else {
            // TODO 未来实现合并；当前退回覆盖
            await dataSyncService.importAllOverwrite(payload)
          }
          setReceiving(false)
          onProgressChange('导入完成')
          toast.success('数据导入完成')
        }
      } catch (e) {
        console.error(e)
        toast.error('数据解析失败')
      }
    })

    webrtcTransferService.onError((err) => {
      console.error(err)
      toast.error(`连接失败: ${err.message}`)
    })

    webrtcTransferService.onClose(() => {
      setConnected(false)
      onProgressChange('连接已断开')
    })
  }

  const handleConnect = () => {
    if (!remotePeerId.trim()) return toast.error('请输入对方的 Peer ID')

    createPeer()

    setTimeout(() => {
      try {
        webrtcTransferService.connectTo(remotePeerId.trim())
      } catch (error) {
        toast.error('连接失败')
        console.error(error)
      }
    }, 1000)
  }

  useEffect(() => {
    return () => {
      webrtcTransferService.destroy()
    }
  }, [])

  return (
    <div className="space-y-2">
      <div className="text-sm text-gray-600">请输入发送端的 Peer ID 进行连接</div>
      <div className="flex gap-2">
        <Input
          variant="ghost"
          size="sm"
          className="flex-1"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
          placeholder="输入发送端的 Peer ID"
        />
        <Button size="sm" onClick={handleConnect} disabled={!remotePeerId.trim()}>
          连接
        </Button>
      </div>
      {connected && (
        <div className="space-y-2">
          <Button variant="secondary" disabled={receiving} icon={Download} className="w-full">
            等待接收中
          </Button>
        </div>
      )}
    </div>
  )
}
