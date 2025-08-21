import { Share2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Drawer, { useDrawer } from '@/components/Drawer'
import Select from '@/components/Select'
import { useSettings } from '@/hooks/useSettings'
import SettingItem from '@/pages/settings/componetns/SettingItem'
import { TransferSettings } from '@/types/settings'
import { validateServers } from '@/utils/webrtc'

import DataSyncServerConfigHelp from './DataSyncServerConfigHelp'
import DataSyncServerSettings from './DataSyncServerSettings'

export default function DataSyncSettings() {
  const { settings, updateTransferSettings } = useSettings()

  const [iceServers, setIceServers] = useState<TransferSettings['iceServers']>(
    settings.transfer?.iceServers ?? []
  )

  const configDrawer = useDrawer()

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
              title={
                <div className="flex items-center justify-center gap-2">
                  <span>配置 ICE/TURN 服务器</span>
                  <DataSyncServerConfigHelp />
                </div>
              }
              open={configDrawer.isOpen}
              onOpenChange={configDrawer.setIsOpen}
              onConfirm={handleConfirm}
              onCancel={handleCancel}
            >
              <DataSyncServerSettings iceServers={iceServers} setIceServers={setIceServers} />
            </Drawer>

            <DataSyncServerConfigHelp />
          </div>
        </SettingItem>
      </div>
    </SettingItem>
  )
}
