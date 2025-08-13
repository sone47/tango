import { BookCheck, Headphones, Play, Share2 } from 'lucide-react'
import { useEffect, useState } from 'react'

import Button from '@/components/Button'
import Card from '@/components/Card'
import Input from '@/components/Input'
import Page from '@/components/Page'
import Select from '@/components/Select'
import Slider from '@/components/Slider'
import Switch from '@/components/Switch'
import { languageOptions } from '@/constants/settings'
import { useSettings } from '@/hooks/useSettings'
import SettingItem from '@/pages/settings/componetns/SettingItem'
import { getVoicesByLanguage, textToSpeech, waitForVoicesReady } from '@/utils/speechUtils'

export default function SettingsPage() {
  const {
    settings,
    updatePracticeSettings,
    updateSpeechSettings,
    updateTransferSettings,
    resetSettings,
  } = useSettings()

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [rate, setRate] = useState(settings.speech.rate)
  const [pitch, setPitch] = useState(settings.speech.pitch)
  const [volume, setVolume] = useState(settings.speech.volume)

  useEffect(() => {
    const loadVoices = async () => {
      const availableVoices = await waitForVoicesReady()
      setVoices(availableVoices)
    }
    loadVoices()
  }, [])

  return (
    <Page title="设置">
      <div className="space-y-6">
        <SettingItem title="练习设置" icon={BookCheck} isCard>
          <SettingItem title="开始时自动洗牌">
            <Switch
              checked={settings.practice.isShuffle}
              onChange={(checked) => updatePracticeSettings({ isShuffle: checked })}
            />
          </SettingItem>
        </SettingItem>

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
                color="var(--color-blue-600)"
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
                color="var(--color-blue-600)"
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
                color="var(--color-blue-600)"
              />
            </SettingItem>

            <Button
              variant="primary"
              size="sm"
              icon={Play}
              // TODO 用户可自行填写测试语音
              onClick={() => textToSpeech('hello world', settings.speech)}
              className="w-full"
            >
              测试语音
            </Button>
          </div>
        </SettingItem>

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
                variant="ghost"
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

        <Card>
          <Button variant="secondary" size="sm" onClick={resetSettings} className="w-full">
            重置所有设置
          </Button>
        </Card>
      </div>
    </Page>
  )
}
