import { useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Input from '@/components/Input'
import Page from '@/components/Page'
import { useSettings } from '@/hooks/useSettings'
import SettingItem from '@/pages/settings/componetns/SettingItem'

export default function AdvanceSettings() {
  const { settings, updateAdvancedSettings } = useSettings()

  const [aiApiKey, setAiApiKey] = useState(settings.advanced.aiApiKey)

  const handleSave = () => {
    updateAdvancedSettings({
      aiApiKey,
    })

    toast.success('保存成功')
  }

  return (
    <Page title="高级设置">
      <div className="flex flex-col gap-4">
        <SettingItem title="例句生成" isCard>
          <SettingItem title="API Key">
            <Input
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              placeholder="请输入 API Key"
            />
          </SettingItem>
        </SettingItem>

        <Button variant="primary" className="w-full" onClick={handleSave}>
          保存设置
        </Button>
      </div>
    </Page>
  )
}
