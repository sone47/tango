import { HelpCircle } from 'lucide-react'

import Drawer from '@/components/Drawer'

import DataSyncConfigGuide from './DataSyncConfigGuide'

export default function DataSyncServerConfigHelp() {
  return (
    <Drawer
      trigger={<HelpCircle className="text-secondary-foreground h-5 w-5 cursor-pointer" />}
      title="配置 ICE/TURN 服务器说明"
    >
      <DataSyncConfigGuide />
    </Drawer>
  )
}
