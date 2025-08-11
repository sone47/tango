import { useEffect, useState } from 'react'

import Button from '@/components/Button'
import Card from '@/components/Card'
import Page from '@/components/Page'

import OfflineBackup from './components/OfflineBackup'
import Receiver from './components/Receiver'
import Sender from './components/Sender'

type Role = 'sender' | 'receiver'

export default function TransferPage() {
  const [role, setRole] = useState<Role | null>(null)
  const [progressMsg, setProgressMsg] = useState('')

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const peerId = urlParams.get('peer')
    if (peerId) {
      setRole('receiver')
    }
  }, [])

  const handleCreateOffer = () => {
    setRole('sender')
  }

  const handleBecomeReceiver = () => {
    setRole('receiver')
  }

  return (
    <Page title="数据同步">
      <div className="space-y-6">
        <Card>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="primary" onClick={handleCreateOffer}>
                我是发送端
              </Button>
              <Button variant="secondary" onClick={handleBecomeReceiver}>
                我是接收端
              </Button>
            </div>

            {role === 'sender' && <Sender onProgressChange={setProgressMsg} />}

            {role === 'receiver' && <Receiver onProgressChange={setProgressMsg} />}

            {progressMsg && <div className="text-sm text-gray-600">{progressMsg}</div>}
          </div>
        </Card>

        <OfflineBackup />
      </div>
    </Page>
  )
}
