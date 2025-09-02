import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

import Button from './Button'
import Typography from './Typography'

interface NavBarProps {
  title?: string
  onBack?: () => void
  className?: string
}

const NavBar = ({ title, onBack, className = '' }: NavBarProps) => {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div
      className={`bg-background backdrop-blur-lg shadow-md flex items-center justify-center relative px-4 py-3 z-1 ${className}`}
    >
      <Button
        variant="ghost"
        size="lg"
        icon={ChevronLeft}
        onClick={handleBack}
        className="absolute left-2"
      />
      {title && <Typography.Title level={5}>{title}</Typography.Title>}
    </div>
  )
}

export default NavBar
