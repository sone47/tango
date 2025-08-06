import { ChevronRight, Headphones, Play, Shuffle } from 'lucide-react'
import { useEffect, useState } from 'react'

import Button from '@/components/Button'
import Card from '@/components/Card'
import Page from '@/components/Page'
import Slider from '@/components/Slider'
import Switch from '@/components/Switch'
import { languageOptions } from '@/constants/settings'
import { useSettings } from '@/hooks/useSettings'
import SettingItem from '@/pages/settings/componetns/SettingItem'
import { getVoicesByLanguage, textToSpeech, waitForVoicesReady } from '@/utils/speechUtils'

export default function SettingsPage() {
  const { settings, updateWordOrderSettings, updateSpeechSettings, resetSettings } = useSettings()

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [showVoiceSelector, setShowVoiceSelector] = useState(false)
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

  const selectedVoice = voices.find((voice) => voice.name === settings.speech.voice)

  return (
    <Page title="设置">
      <div className="space-y-6">
        <SettingItem title="练习设置" icon={Shuffle} iconColor="blue" isCard>
          <SettingItem title="开始时自动洗牌">
            <Switch
              checked={settings.wordOrder.mode === 'random'}
              onChange={(checked) =>
                updateWordOrderSettings({ mode: checked ? 'random' : 'sequential' })
              }
            />
          </SettingItem>
        </SettingItem>

        <SettingItem title="语音设置" icon={Headphones} iconColor="green" isCard>
          <div className="space-y-4 w-full">
            <SettingItem title="语言">
              <select
                value={settings.speech.language}
                onChange={(e) => updateSpeechSettings({ language: e.target.value })}
                className="text-sm bg-gray-100 rounded-lg px-3 py-1 border-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {languageOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </SettingItem>

            {voices.length && (
              <SettingItem title="语音" description={selectedVoice?.name ?? ''}>
                <button
                  onClick={() => setShowVoiceSelector(!showVoiceSelector)}
                  className="flex items-center gap-1 text-sm text-blue-600"
                >
                  选择
                  <ChevronRight size={14} />
                </button>
              </SettingItem>
            )}

            {showVoiceSelector && (
              <div className="bg-gray-50 rounded-xl p-3 space-y-2 max-h-32 overflow-y-auto">
                {getVoicesByLanguage(settings.speech.language).map((voice) => (
                  <button
                    key={voice.name}
                    onClick={() => {
                      updateSpeechSettings({ voice: voice.name })
                    }}
                    className={`w-full text-left text-sm p-2 rounded-lg transition-colors ${
                      voice.name === settings.speech.voice
                        ? 'bg-blue-100 text-blue-600'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {voice.name}
                  </button>
                ))}
              </div>
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
              onClick={() => textToSpeech('hello world', settings.speech)}
              className="w-full"
            >
              测试语音
            </Button>
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
