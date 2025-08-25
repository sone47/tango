import { Headphones, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

import Button from '@/components/Button'
import Drawer, { useDrawer } from '@/components/Drawer'
import Select from '@/components/Select'
import Slider from '@/components/Slider'
import Textarea from '@/components/Textarea'
import { languageOptions } from '@/constants/settings'
import { useSettings } from '@/hooks/useSettings'
import { useTTS } from '@/hooks/useTTS'
import SettingItem from '@/pages/settings/componetns/SettingItem'
import { getVoicesByLanguage } from '@/utils/speechUtils'

export default function SpeechSettings() {
  const { settings, updateSpeechSettings } = useSettings()
  const drawer = useDrawer()
  const { isGlobalLoading, start, setText } = useTTS('')

  const [voices, setVoices] = useState<{ value: string; label: string }[]>([])
  const [rate, setRate] = useState(settings.speech.rate)
  const [voiceText, setVoiceText] = useState('hello world')

  useEffect(() => {
    setVoices(getVoicesByLanguage(settings.speech.language) as any)
  }, [settings.speech.language])

  useEffect(() => {
    setRate(settings.speech.rate)
  }, [settings.speech.rate])

  useEffect(() => {
    setText(voiceText)
  }, [voiceText])

  return (
    <SettingItem title="语音设置" icon={Headphones} isCard>
      <div className="space-y-4 w-full">
        <SettingItem title="语言">
          <Select
            className="w-[136px]"
            triggerClassName="w-full"
            size="sm"
            options={languageOptions}
            value={settings.speech.language}
            onValueChange={(value) => updateSpeechSettings({ language: value })}
          />
        </SettingItem>
        <SettingItem title="语音">
          <Select
            className="w-[136px]"
            triggerClassName="w-full"
            disabled={!settings.speech.language}
            size="sm"
            contentClassName="max-h-60 overflow-y-auto"
            options={voices}
            value={settings.speech.voice}
            onValueChange={(value) => updateSpeechSettings({ voice: value })}
          ></Select>
        </SettingItem>
        <SettingItem title="语速">
          <Slider
            value={rate}
            min={0.1}
            max={2}
            step={0.1}
            onChange={(rate) => setRate(rate)}
            onChangeComplete={() => updateSpeechSettings({ rate })}
            formatValue={(v) => `${v.toFixed(1)}x`}
            showValue={true}
            size="md"
          />
        </SettingItem>
        <Drawer
          trigger={
            <Button className="w-full" variant="outline" size="sm">
              测试语音
            </Button>
          }
          footer={
            <Button
              className="w-full"
              variant="primary"
              icon={Play}
              disabled={!voiceText}
              loading={isGlobalLoading}
              onClick={start}
            >
              播放测试语音
            </Button>
          }
          open={drawer.isOpen}
          onOpenChange={drawer.setIsOpen}
          title="测试语音"
        >
          <Textarea
            placeholder="请输入要测试的文本"
            value={voiceText}
            onChange={(e) => {
              setVoiceText(e.target.value)
            }}
          />
        </Drawer>
      </div>
    </SettingItem>
  )
}
