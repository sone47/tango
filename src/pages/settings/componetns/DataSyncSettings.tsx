import { Share2 } from 'lucide-react'

import Input from '@/components/Input'
import Select from '@/components/Select'
import { useSettings } from '@/hooks/useSettings'
import SettingItem from '@/pages/settings/componetns/SettingItem'

export default function DataSyncSettings() {
  const { settings, updateTransferSettings } = useSettings()

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

        <SettingItem title="ICE/TURN 服务器" description="可填写多个，用英文逗号分隔">
          <Input
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
          />
        </SettingItem>
      </div>
    </SettingItem>
  )
}
