import Button from '@/components/Button'
import Page from '@/components/Page'
import { useSettings } from '@/hooks/useSettings'

import DataSyncSettings from './componetns/DataSyncSettings'
import PracticeSettings from './componetns/PracticeSettings'
import SpeechSettings from './componetns/SpeechSettings'

export default function SettingsPage() {
  const { resetSettings } = useSettings()

  return (
    <Page title="设置">
      <div className="space-y-6">
        <PracticeSettings />
        <SpeechSettings />
        <DataSyncSettings />

        <Button variant="outline" size="sm" onClick={resetSettings} className="w-full">
          重置所有设置
        </Button>
      </div>
    </Page>
  )
}
