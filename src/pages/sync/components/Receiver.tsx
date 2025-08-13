import { CircleCheck, Download, LoaderCircle, LucideIcon } from 'lucide-react'
import { useEffect, useState } from 'react'

import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Input'
import toast from '@/components/Toast'
import Typography from '@/components/Typography'
import { Separator } from '@/components/ui/separator'
import { useSettings } from '@/hooks/useSettings'
import { type DataSyncPayload, dataSyncService } from '@/services/dataSyncService'
import { type LogEntry, webrtcTransferService } from '@/services/webrtcTransferService'

import DebugLogger from './DebugLogger'

export default function Receiver() {
  const { settings } = useSettings()

  const [remotePeerId, setRemotePeerId] = useState('')
  const [connected, setConnected] = useState(false)
  const [connectLoading, setConnectLoading] = useState(false)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [receiveProgress, setReceiveProgress] = useState<
    {
      icon: LucideIcon
      text: string
      iconClassName?: string
    }[]
  >([])

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

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const peerId = urlParams.get('peer')
    if (peerId) {
      setRemotePeerId(decodeURIComponent(peerId))
    }
  }, [])

  useEffect(() => {
    if (!connected) return

    setReceiveProgress([
      {
        icon: CircleCheck,
        text: '您已成功与另一台设备配对',
        iconClassName: 'text-green-500',
      },
      {
        icon: LoaderCircle,
        text: '等待另一台设备传输数据',
        iconClassName: 'animate-spin text-gray-400',
      },
    ])
  }, [connected])

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

    webrtcTransferService.onConnect(() => {
      setConnected(true)
      setConnectLoading(false)
      toast.success('连接成功')
    })

    webrtcTransferService.onData(handleData)

    webrtcTransferService.onError((err) => {
      setConnectLoading(false)
      console.error(err)
      toast.error('连接失败')
    })

    await webrtcTransferService.create({ initiator: false, iceServers })
  }

  const handleBeforeCreatePeer = () => {
    webrtcTransferService.destroy()
    setConnected(false)
    setReceiveProgress([])
  }

  const handleConnect = async () => {
    if (!remotePeerId.trim()) return toast.error('请输入对方的配对 ID')

    try {
      setConnectLoading(true)
      await createPeer()

      webrtcTransferService.connectTo(remotePeerId.trim())
    } catch (error) {
      console.error(error)
      toast.error('连接失败')
    }
  }

  const handleData = async (chunk: Uint8Array) => {
    handleReceiveDataSuccess()

    try {
      const text = new TextDecoder().decode(chunk)
      const message = JSON.parse(text)
      if (message.type === 'payload') {
        const payload = message.payload as DataSyncPayload
        const strategy = settings.transfer?.importStrategy || 'overwrite'
        if (strategy === 'overwrite') {
          await dataSyncService.importAllOverwrite(payload)
        } else {
          // TODO 未来实现合并
          await dataSyncService.importAllOverwrite(payload)
        }
      }

      setReceiveProgress([
        {
          icon: CircleCheck,
          text: '数据导入完成',
          iconClassName: 'text-green-500',
        },
      ])
    } catch (e) {
      toast.error('接收失败')
      console.error(e)
    }
  }

  const handleReceiveDataSuccess = () => {
    webrtcTransferService.send(new TextEncoder().encode('success'))

    setReceiveProgress([
      {
        icon: CircleCheck,
        text: '数据接收成功',
        iconClassName: 'text-green-500',
      },
      {
        icon: LoaderCircle,
        text: '正在导入数据',
        iconClassName: 'animate-spin text-gray-400',
      },
    ])
    webrtcTransferService.destroy()
  }

  const handleImportJSON = async (file: File) => {
    try {
      const text = await file.text()
      const payload = JSON.parse(text) as DataSyncPayload
      await dataSyncService.importAllOverwrite(payload)
      toast.success('导入完成')
    } catch (error) {
      toast.error('导入失败')
      console.error(error)
    }
  }

  useEffect(() => {
    return () => {
      webrtcTransferService.destroy()
    }
  }, [])

  return (
    <div className="space-y-4">
      <Card contentClassName="space-y-3">
        {connected ? (
          <div className="flex flex-col">
            {receiveProgress.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <item.icon className={`w-4 h-4 ${item.iconClassName}`} />
                <Typography.Text size="xs">{item.text}</Typography.Text>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full flex gap-2">
            <Input
              variant="ghost"
              size="sm"
              className="flex-1"
              value={remotePeerId}
              onChange={(e) => setRemotePeerId(e.target.value)}
              placeholder="请输入配对 ID"
            />
            <Button
              size="sm"
              onClick={handleConnect}
              disabled={!remotePeerId.trim() || connected}
              loading={connectLoading}
            >
              {connectLoading ? '配对中...' : '确认配对'}
            </Button>
          </div>
        )}

        <Separator className="my-4" />
        <DebugLogger logs={logs} onClear={clearLogs} title="传输日志" />
      </Card>

      <Card contentClassName="flex flex-col gap-2">
        <label className="w-full cursor-pointer">
          <input
            type="file"
            accept="application/json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && handleImportJSON(e.target.files[0])}
          />
          <Button
            variant="secondary"
            size="sm"
            icon={Download}
            className="w-full pointer-events-none"
          >
            导入数据文件
          </Button>
        </label>
        <Typography.Text type="secondary" size="xs">
          当配对功能无法使用时，请使用数据导入
        </Typography.Text>
      </Card>
    </div>
  )
}
