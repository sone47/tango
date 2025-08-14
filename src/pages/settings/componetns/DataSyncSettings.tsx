import { HelpCircle, Share2 } from 'lucide-react'
import { useState } from 'react'

import Button from '@/components/Button'
import Drawer, { useDrawer } from '@/components/Drawer'
import Input from '@/components/Input'
import Select from '@/components/Select'
import { useSettings } from '@/hooks/useSettings'
import SettingItem from '@/pages/settings/componetns/SettingItem'
import { TransferSettings } from '@/types/settings'

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
    console.log('add server')
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
              contentClassName="h-full"
              trigger={
                <Button size="sm" variant="outline" className="w-1/2">
                  配置
                </Button>
              }
              cancelText="取消"
              confirmText="确定"
              confirmVariant="outline"
              cancelVariant="secondary"
              showConfirm
              showCancel
              title="配置 ICE/TURN 服务器"
              open={configDrawer.isOpen}
              onOpenChange={configDrawer.setIsOpen}
            >
              <div className="flex flex-col gap-2">
                <Input placeholder="请输入服务器地址，多个地址用英文逗号分隔" />
                <Input placeholder="请输入用户名" />
                <Input placeholder="请输入密码" />
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
              编辑中...
            </Drawer>
          </div>
          {/* <Input
            size="sm"
            defaultValue={
              Array.isArray(settings.transfer?.iceServers)
                ? settings.transfer.iceServers
                    .map((s) => (typeof s.urls === 'string' ? s.urls : s.urls[0]))
                    .join(',')
                : ''
            }
            onBlur={(e) => {
              const value = e.target.value.trim()
              const urls = value
                ? value
                    .split(',')
                    .map((v) => v.trim())
                    .filter(Boolean)
                : ['stun:stun.l.google.com:19302']
              updateTransferSettings({ iceServers: urls.map((u) => ({ urls: u })) })
            }}
            placeholder="stun:stun.l.google.com:19302, turn:example.com:3478"
            className="w-full"
          /> */}
        </SettingItem>
      </div>
    </SettingItem>
  )
}
