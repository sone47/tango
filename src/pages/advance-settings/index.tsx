import { useState } from 'react'
import { useNavigate } from 'react-router'

import AlertDialog from '@/components/AlertDialog'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Page from '@/components/Page'
import { useSettings } from '@/hooks/useSettings'
import SettingItem from '@/pages/settings/componetns/SettingItem'

export default function AdvanceSettings() {
  const { settings, updateAdvancedSettings } = useSettings()
  const navigate = useNavigate()
  const [aiApiKey, setAiApiKey] = useState(settings.advanced.aiApiKey)

  const handleSave = () => {
    updateAdvancedSettings({
      aiApiKey,
    })
  }

  return (
    <Page title="高级设置">
      <div className="flex flex-col gap-4">
        <SettingItem title="生成例句" isCard>
          <SettingItem title="API Key">
            <Input
              value={aiApiKey}
              onChange={(e) => setAiApiKey(e.target.value)}
              placeholder="请输入 API Key"
            />
          </SettingItem>
        </SettingItem>

        <AlertDialog
          title="保存成功"
          confirmText="返回上一页"
          cancelText="继续设置"
          onConfirm={() => {
            navigate(-1)
          }}
          trigger={
            <Button variant="primary" className="w-full" onClick={handleSave}>
              保存设置
            </Button>
          }
        />
      </div>
    </Page>
  )
}
