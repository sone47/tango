import { HelpCircle } from 'lucide-react'

import Drawer from '@/components/Drawer'

import DataSyncConfigGuide from './DataSyncConfigGuide'

export default function DataSyncServerConfigHelp() {
  return (
    <Drawer
      trigger={<HelpCircle className="w-5 h-5 text-secondary-foreground cursor-pointer" />}
      title="配置 ICE/TURN 服务器说明"
    >
      <DataSyncConfigGuide />
    </Drawer>
  )
}
