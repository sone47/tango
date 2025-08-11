import { useEffect, useState } from 'react'

import Card from '@/components/Card'
import Page from '@/components/Page'
import { Tabs } from '@/components/Tabs'

import OfflineBackup from './components/OfflineBackup'
import Receiver from './components/Receiver'
import Sender from './components/Sender'

type Role = 'sender' | 'receiver'

export default function TransferPage() {
  const [isLoad, setIsLoad] = useState(false)
  const [role, setRole] = useState<Role>('sender')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const peerId = urlParams.get('peer')
    if (peerId) {
      setRole('receiver')
    }

    setIsLoad(true)
  }, [])

  return (
    <Page title="数据同步">
      <div className="space-y-6">
        <Card>
          {isLoad && (
            <Tabs
              tabs={[
                { label: '我是发送端', value: 'sender', component: <Sender /> },
                { label: '我是接收端', value: 'receiver', component: <Receiver /> },
              ]}
              defaultValue={role}
            />
          )}
        </Card>

        <OfflineBackup />
      </div>
    </Page>
  )
}
