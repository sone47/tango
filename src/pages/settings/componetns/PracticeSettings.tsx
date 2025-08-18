import { BookCheck } from 'lucide-react'

import Switch from '@/components/Switch'
import ToggleGroup from '@/components/ToggleGroup'
import { useSettings } from '@/hooks/useSettings'

import SettingItem from './SettingItem'

export default function PracticeSettings() {
  const { settings, updatePracticeSettings } = useSettings()

  const hiddenInCardOptions = [
    { value: 'phonetic', label: '音标' },
    { value: 'word', label: '单词' },
    { value: 'definition', label: '释义' },
  ]

  return (
    <SettingItem title="练习设置" icon={BookCheck} isCard>
      <div className="space-y-4 w-full">
        <SettingItem title="开始时自动洗牌">
          <Switch
            checked={settings.practice.isShuffle}
            onChange={(checked) => updatePracticeSettings({ isShuffle: checked })}
          />
        </SettingItem>
        <SettingItem title="开始时自动播放单词语音">
          <Switch
            checked={settings.practice.isAutoPlayAudio}
            onChange={(checked) => updatePracticeSettings({ isAutoPlayAudio: checked })}
          />
        </SettingItem>
        <SettingItem title="卡面隐藏">
          <ToggleGroup
            size="sm"
            type="multiple"
            variant="outline"
            options={hiddenInCardOptions}
            values={settings.practice.hiddenInCard}
            onValuesChange={(values) => updatePracticeSettings({ hiddenInCard: values as any })}
          />
        </SettingItem>
      </div>
    </SettingItem>
  )
}
