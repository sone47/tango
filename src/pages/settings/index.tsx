import { Cog } from 'lucide-react'

import Page from '@/components/Page'

import DataSyncSettings from './componetns/DataSyncSettings'
import MoreSettingButton from './componetns/MoreSettingButton'
import PracticeSettings from './componetns/PracticeSettings'
import ResetButton from './componetns/ResetButton'
import SpeechSettings from './componetns/SpeechSettings'

export default function SettingsPage() {
  return (
    <Page title="设置">
      <div className="space-y-6">
        <div className="space-y-4">
          <PracticeSettings />
          <SpeechSettings />
          <DataSyncSettings />
          <MoreSettingButton label="高级设置" path="/settings/advanced" icon={Cog} />
        </div>
        <ResetButton />
      </div>
    </Page>
  )
}
