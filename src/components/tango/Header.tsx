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
    <div className="w-full flex justify-between items-center bg-card backdrop-blur-sm p-2 pl-4 border-b-1">
      <Typography.Title level={4} className="!font-bold">
        {title}
      </Typography.Title>
      <div className="flex items-center">
        <Button variant="ghost" size="md" icon={RefreshCw} onClick={handleSyncClick} />
        <Button variant="ghost" size="md" icon={Settings} onClick={handleSettingsClick} />
      </div>
    </div>
  )
}

export default Header
