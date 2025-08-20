import { Cog } from 'lucide-react'

import Button from '@/components/Button'
import Page from '@/components/Page'
import { useSettings } from '@/hooks/useSettings'

import DataSyncSettings from './componetns/DataSyncSettings'
import MoreSettingButton from './componetns/MoreSettingButton'
import PracticeSettings from './componetns/PracticeSettings'
import SpeechSettings from './componetns/SpeechSettings'

export default function SettingsPage() {
  const { resetSettings } = useSettings()

  return (
    <Page title="设置">
      <div className="space-y-6">
        <div className="space-y-4">
          <PracticeSettings />
          <SpeechSettings />
          <DataSyncSettings />
          <MoreSettingButton label="高级设置" path="/settings/advanced" icon={Cog} />
        </div>
        <Button variant="outline" size="md" onClick={resetSettings} className="w-full">
          重置所有设置
        </Button>
      </div>
    </Page>
  )
}
