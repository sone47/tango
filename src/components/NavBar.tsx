import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

import Button from './Button'

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
    <div className={`bg-white/80 backdrop-blur-lg border-b border-gray-200/50 ${className}`}>
      <div className="flex items-center justify-center relative px-4 py-3">
        <Button
          variant="ghost"
          size="lg"
          icon={ChevronLeft}
          onClick={handleBack}
          className="absolute left-4 !px-2"
        />
        {title && <h1 className="text-lg font-semibold text-gray-900">{title}</h1>}
      </div>
    </div>
  )
}

export default NavBar
