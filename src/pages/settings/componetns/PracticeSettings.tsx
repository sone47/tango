import isIos from '@braintree/browser-detection/dist/is-ios'
import { BookCheck } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Drawer, { useDrawer } from '@/components/Drawer'
import { Switch } from '@/components/ui/switch'
import { FlashCardItemEnum, FlashCardItemNameMap } from '@/constants/flashCard'
import { useSettings } from '@/hooks/useSettings'
import { cn } from '@/lib/utils'

import SettingItem from './SettingItem'

export default function PracticeSettings() {
  const { settings, updatePracticeSettings } = useSettings()
  const cardConfigDrawer = useDrawer()

  const [cardConfig, setCardConfig] = useState<
    Partial<{
      [key in FlashCardItemEnum]: boolean
    }>
  >({})

  useEffect(() => {
    if (!cardConfigDrawer.isOpen) return

    setCardConfig(
      Object.fromEntries(settings.practice.hiddenInCard.map((item) => [item, true])) as {
        [key in FlashCardItemEnum]: boolean
      }
    )
  }, [cardConfigDrawer.isOpen])

  const hiddenInCardOptions = [
    { value: FlashCardItemEnum.phonetic, label: FlashCardItemNameMap[FlashCardItemEnum.phonetic] },
    { value: FlashCardItemEnum.word, label: FlashCardItemNameMap[FlashCardItemEnum.word] },
    {
      value: FlashCardItemEnum.definition,
      label: FlashCardItemNameMap[FlashCardItemEnum.definition],
    },
  ]

  const handleCardConfigChange = (value: FlashCardItemEnum, checked: boolean) => {
    setCardConfig((prev) => ({
      ...prev,
      [value]: checked,
    }))
  }

  const handleSaveCardConfig = () => {
    updatePracticeSettings({
      hiddenInCard: Object.entries(cardConfig)
        .filter(([_, value]) => value)
        .map(([key]) => key) as FlashCardItemEnum[],
    })

    toast.success('卡片设置已保存')
    cardConfigDrawer.setIsOpen(false)
  }

  return (
    <SettingItem title="练习设置" icon={BookCheck} isCard>
      <div className="space-y-4 w-full">
        <SettingItem title="开始时自动洗牌">
          <Switch
            checked={settings.practice.isShuffle}
            onCheckedChange={(checked) => updatePracticeSettings({ isShuffle: checked })}
          />
        </SettingItem>
        {isIos() ? null : (
          <SettingItem title="开始时自动播放单词语音">
            <Switch
              checked={settings.practice.isAutoPlayAudio}
              onCheckedChange={(checked) => updatePracticeSettings({ isAutoPlayAudio: checked })}
            />
          </SettingItem>
        )}
        <SettingItem title="卡片设置">
          <Drawer
            open={cardConfigDrawer.isOpen}
            onOpenChange={cardConfigDrawer.setIsOpen}
            contentClassName="flex flex-col gap-2 overflow-hidden"
            title="卡片设置"
            description="设置学习卡片展示内容"
            trigger={
              <Button variant="outline" size="sm" className="w-[136px]">
                设置
              </Button>
            }
            showConfirm
            confirmText="保存卡片设置"
            onConfirm={handleSaveCardConfig}
            showCancel
          >
            <>
              <div className="flex-1 flex justify-center items-center">
                <div className="bg-background border h-[80px] w-[100px] rounded-md flex flex-col items-center gap-2 p-1">
                  <div
                    className={cn(
                      'h-1/3 w-full rounded-xs transition-all duration-300 bg-blue-200',
                      cardConfig[FlashCardItemEnum.phonetic] ? '' : 'translate-x-full bg-opacity-0'
                    )}
                  ></div>
                  <div
                    className={cn(
                      'h-1/3 w-full rounded-xs transition-all duration-300 bg-purple-200',
                      cardConfig[FlashCardItemEnum.word] ? '' : 'translate-x-full bg-opacity-0'
                    )}
                  ></div>
                  <div
                    className={cn(
                      'h-1/3 w-full rounded-xs transition-all duration-300 bg-emerald-200',
                      cardConfig[FlashCardItemEnum.definition]
                        ? ''
                        : 'translate-x-full bg-opacity-0'
                    )}
                  ></div>
                </div>
              </div>
              <div className="flex-1 flex flex-col gap-2">
                {hiddenInCardOptions.map((option) => (
                  <SettingItem key={option.value} title={option.label} titleClassName="text-md">
                    <Switch
                      checked={!!cardConfig[option.value]}
                      onCheckedChange={(checked) => handleCardConfigChange(option.value, checked)}
                    />
                  </SettingItem>
                ))}
              </div>
            </>
          </Drawer>
        </SettingItem>
      </div>
    </SettingItem>
  )
}
