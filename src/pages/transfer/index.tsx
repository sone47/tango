import { useEffect, useState } from 'react'

import Page from '@/components/Page'
import { Tabs } from '@/components/Tabs'

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
      {isLoad && (
        <Tabs
          defaultValue={role}
          tabs={[
            {
              label: '发送',
              value: 'sender',
              component: <Sender />,
            },
            {
              label: '接收',
              value: 'receiver',
              component: <Receiver />,
            },
          ]}
        />
      )}
    </Page>
  )
}
