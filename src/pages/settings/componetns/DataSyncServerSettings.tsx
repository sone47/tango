import { Separator } from '@radix-ui/react-dropdown-menu'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Input from '@/components/Input'
import Textarea from '@/components/Textarea'
import { TransferSettings } from '@/types/settings'
import { testConnection } from '@/utils/webrtc'

interface DataSyncServerSettingsProps {
  iceServers: TransferSettings['iceServers']
  setIceServers: (iceServers: TransferSettings['iceServers']) => void
}

export default function DataSyncServerSettings({
  iceServers,
  setIceServers,
}: DataSyncServerSettingsProps) {
  const handleRemoveServer = (server: TransferSettings['iceServers'][number]) => {
    // TODO 删除到最后一个服务器提示
    setIceServers(iceServers.filter((s) => s !== server))
  }

  const handleServerChange = (server: TransferSettings['iceServers'][number], urls: string[]) => {
    setIceServers(iceServers.map((s) => (s === server ? { ...s, urls } : s)))
  }

  const handleUsernameChange = (
    server: TransferSettings['iceServers'][number],
    username: string
  ) => {
    setIceServers(iceServers.map((s) => (s === server ? { ...s, username } : s)))
  }

  const handleCredentialChange = (
    server: TransferSettings['iceServers'][number],
    credential: string
  ) => {
    setIceServers(iceServers.map((s) => (s === server ? { ...s, credential } : s)))
  }

  const handleTestConnection = async (server: TransferSettings['iceServers'][number]) => {
    toast.promise(testConnection(server), {
      loading: '正在测试连接...',
      success: '服务器连接测试成功！可以正常获取网络候选',
      error: (error) => (error instanceof Error ? error.message : '连接测试失败'),
    })
  }

  const handleAddServer = () => {
    setIceServers([...iceServers, { urls: [], username: '', credential: '' }])
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {iceServers.map((server, index) => (
          <>
            <div key={index} className="flex flex-col gap-2">
              <Textarea
                placeholder={`请输入服务器地址，多个地址用换行分隔。如：\nstun:stun.l.google.com:19302\nturn:your-server.com:3478`}
                value={server.urls?.join('\n')}
                onChange={(e) => handleServerChange(server, e.target.value.split('\n'))}
              />
              <Input
                placeholder="请输入用户名"
                value={server.username}
                onChange={(e) => handleUsernameChange(server, e.target.value)}
              />
              <Input
                placeholder="请输入密码"
                value={server.credential}
                onChange={(e) => handleCredentialChange(server, e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  disabled={!server.urls?.length}
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(server))
                    toast.success('复制成功')
                  }}
                >
                  复制服务器信息
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    navigator.clipboard.readText().then((text) => {
                      const copiedServer = JSON.parse(text)
                      setIceServers(iceServers.map((s) => (s === server ? copiedServer : s)))
                    })
                  }}
                >
                  粘贴服务器信息
                </Button>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                disabled={!server.urls?.length}
                onClick={() => handleTestConnection(server)}
              >
                测试连接
              </Button>
              <Button
                size="sm"
                variant="destructive"
                className="w-full"
                onClick={() => handleRemoveServer(server)}
              >
                删除服务器
              </Button>
            </div>

            <Separator />
          </>
        ))}
      </div>
      <Button size="sm" variant="outline" className="w-full" onClick={handleAddServer}>
        添加服务器
      </Button>
    </>
  )
}
