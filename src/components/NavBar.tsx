import { ChevronLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'

import Button from './Button'
import Typography from './Typography'

interface NavBarProps {
  title?: ReactNode
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
      className={`bg-card relative z-1 flex items-center justify-center border-b-1 px-4 py-3 backdrop-blur-lg ${className}`}
    >
      <Button
        variant="ghost"
        size="lg"
        icon={ChevronLeft}
        onClick={handleBack}
        className="absolute -left-2"
      />
      {title && <Typography.Title level={5}>{title}</Typography.Title>}
    </div>
  )
}

export default NavBar
