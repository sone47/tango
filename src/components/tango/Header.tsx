import { RefreshCw, Settings } from 'lucide-react'
import { useNavigate } from 'react-router'

import Button from '@/components/Button'
import Typography from '@/components/Typography'

interface HeaderProps {
  title: string
}

const Header = ({ title }: HeaderProps) => {
  const navigate = useNavigate()

  const handleSyncClick = () => {
    navigate('/sync')
  }

  const handleSettingsClick = () => {
    navigate('/settings')
  }

  return (
    <div className="w-full flex justify-between items-center bg-background backdrop-blur-sm py-2 px-6">
      <Typography.Title level={4} className="!font-bold">
        {title}
      </Typography.Title>
      <div className="flex items-center gap-6">
        <Button
          variant="ghost"
          size="md"
          className="!p-0"
          icon={RefreshCw}
          onClick={handleSyncClick}
        />
        <Button
          variant="ghost"
          size="md"
          className="!p-0"
          icon={Settings}
          onClick={handleSettingsClick}
        />
      </div>
    </div>
  )
}

export default Header
