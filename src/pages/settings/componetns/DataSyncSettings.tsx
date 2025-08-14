import { HelpCircle, Share2 } from 'lucide-react'
import { useState } from 'react'

import Button from '@/components/Button'
import Drawer, { useDrawer } from '@/components/Drawer'
import Input from '@/components/Input'
import Select from '@/components/Select'
import Textarea from '@/components/Textarea'
import toast from '@/components/Toast'
import { Separator } from '@/components/ui/separator'
import { useSettings } from '@/hooks/useSettings'
import DataSyncConfigGuide from '@/pages/settings/componetns/DataSyncConfigGuide'
import SettingItem from '@/pages/settings/componetns/SettingItem'
import { TransferSettings } from '@/types/settings'
import { testConnection, validateServers } from '@/utils/webrtc'

export default function DataSyncSettings() {
  const { settings, updateTransferSettings } = useSettings()

  const [iceServers, setIceServers] = useState<TransferSettings['iceServers']>(
    settings.transfer?.iceServers ?? []
  )

  const configDrawer = useDrawer()
  const helpDrawer = useDrawer()

  const handleHelpClick = () => {
    helpDrawer.setIsOpen(true)
  }

  const handleAddServer = () => {
    setIceServers([...iceServers, { urls: [], username: '', credential: '' }])
  }

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

  const handleConfirm = () => {
    try {
      validateServers(iceServers)

      updateTransferSettings({ iceServers })
      configDrawer.setIsOpen(false)

      toast.success('服务器配置已保存')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '服务器配置不正确')
    }
  }

  const handleCancel = () => {
    configDrawer.setIsOpen(false)
  }

  const handleTestConnection = async (server: TransferSettings['iceServers'][number]) => {
    const dismissToast = toast.loading('正在测试连接...')
    try {
      await testConnection(server)
      toast.success('服务器连接测试成功！可以正常获取网络候选')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : '连接测试失败')
    } finally {
      dismissToast()
    }
  }

  return (
    <SettingItem title="数据同步" icon={Share2} isCard>
      <div className="space-y-4 w-full">
        <SettingItem title="接收策略">
          <Select
            className="w-1/2"
            triggerClassName="w-full"
            size="sm"
            options={[
              { value: 'overwrite', label: '覆盖' },
              { value: 'merge', label: '合并（规划中）', disabled: true },
            ]}
            value={settings.transfer?.importStrategy ?? 'overwrite'}
            onValueChange={(value) =>
              updateTransferSettings({ importStrategy: value as 'overwrite' | 'merge' })
            }
          />
        </SettingItem>

        <SettingItem title="ICE/TURN 服务器">
          <div className="flex items-center justify-end gap-2 w-full">
            <Drawer
              className="h-full"
              contentClassName="flex flex-col gap-4"
              footerClassName="border-t bg-card-foreground/5"
              trigger={
                <Button size="sm" variant="outline" className="w-1/2">
                  配置
                </Button>
              }
              cancelText="取消"
              confirmText="确定"
              confirmVariant="outline"
              cancelVariant="ghost"
              showConfirm
              showCancel
              title="配置 ICE/TURN 服务器"
              open={configDrawer.isOpen}
              onOpenChange={configDrawer.setIsOpen}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            >
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
                              setIceServers(
                                iceServers.map((s) => (s === server ? copiedServer : s))
                              )
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
            </Drawer>

            <Drawer
              trigger={
                <HelpCircle
                  className="w-5 h-5 text-secondary-foreground cursor-pointer"
                  onClick={handleHelpClick}
                />
              }
              title="配置 ICE/TURN 服务器说明"
              open={helpDrawer.isOpen}
              onOpenChange={helpDrawer.setIsOpen}
            >
              <DataSyncConfigGuide />
            </Drawer>
          </div>
        </SettingItem>
      </div>
    </SettingItem>
  )
}
