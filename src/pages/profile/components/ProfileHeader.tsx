import { Bolt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/Button'
import Typography from '@/components/Typography'

const ProfileHeader = () => {
  const navigate = useNavigate()

  const handleSettingsClick = () => {
    navigate('/settings')
  }

  return (
    <div className="w-full flex justify-between items-center bg-white/70 backdrop-blur-sm py-4 px-6">
      <Typography.Title level={3} className="!font-bold">
        我的学习
      </Typography.Title>
      <Button
        variant="ghost"
        size="xl"
        className="!p-0"
        icon={Bolt}
        onClick={handleSettingsClick}
      />
    </div>
  )
}

export default ProfileHeader
