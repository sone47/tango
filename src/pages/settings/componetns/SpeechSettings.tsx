import { Headphones, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

import Button from '@/components/Button'
import Drawer, { useDrawer } from '@/components/Drawer'
import Select from '@/components/Select'
import Slider from '@/components/Slider'
import Textarea from '@/components/Textarea'
import { languageOptions } from '@/constants/settings'
import { useSettings } from '@/hooks/useSettings'
import SettingItem from '@/pages/settings/componetns/SettingItem'
import { getVoicesByLanguage, textToSpeech, waitForVoicesReady } from '@/utils/speechUtils'

export default function SpeechSettings() {
  const { settings, updateSpeechSettings } = useSettings()
  const drawer = useDrawer()

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [rate, setRate] = useState(settings.speech.rate)
  const [pitch, setPitch] = useState(settings.speech.pitch)
  const [volume, setVolume] = useState(settings.speech.volume)
  const [voiceText, setVoiceText] = useState('hello world')

  useEffect(() => {
    const loadVoices = async () => {
      const availableVoices = await waitForVoicesReady()
      setVoices(availableVoices)
    }
    loadVoices()
  }, [])

  return (
    <SettingItem title="语音设置" icon={Headphones} isCard>
      <div className="space-y-4 w-full">
        <SettingItem title="语言">
          <Select
            className="w-1/2"
            triggerClassName="w-full"
            size="sm"
            options={languageOptions}
            value={settings.speech.language}
            onValueChange={(value) => updateSpeechSettings({ language: value })}
          />
        </SettingItem>

        {voices.length > 0 && (
          <SettingItem title="语音">
            <Select
              size="sm"
              contentClassName="max-h-60 overflow-y-auto"
              options={getVoicesByLanguage(settings.speech.language).map((voice) => ({
                value: voice.name,
                label: voice.name,
              }))}
              value={settings.speech.voice}
              onValueChange={(value) => updateSpeechSettings({ voice: value })}
            ></Select>
          </SettingItem>
        )}

        <SettingItem title="语速">
          <Slider
            value={rate}
            min={0.5}
            max={2.0}
            step={0.1}
            onChange={(rate) => setRate(rate)}
            onChangeComplete={() => updateSpeechSettings({ rate })}
            formatValue={(v) => `${v.toFixed(1)}x`}
            showValue={true}
            size="md"
          />
        </SettingItem>

        <SettingItem title="音调">
          <Slider
            value={pitch}
            min={0.5}
            max={2.0}
            step={0.1}
            onChange={(pitch) => setPitch(pitch)}
            onChangeComplete={() => updateSpeechSettings({ pitch })}
            formatValue={(v) => v.toFixed(1)}
            showValue={true}
            size="md"
          />
        </SettingItem>

        <SettingItem title="音量">
          <Slider
            value={volume}
            min={0.1}
            max={1.0}
            step={0.01}
            onChange={(volume) => setVolume(volume)}
            onChangeComplete={() => updateSpeechSettings({ volume })}
            formatValue={(v) => `${Math.round(v * 100)}%`}
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
              onClick={() => textToSpeech(voiceText, settings.speech)}
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
            onChange={(e) => setVoiceText(e.target.value)}
          />
        </Drawer>
      </div>
    </SettingItem>
  )
}
