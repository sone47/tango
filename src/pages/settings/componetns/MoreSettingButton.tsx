import { ChevronRight, LucideIcon } from 'lucide-react'
import { useNavigate } from 'react-router'

import Button from '@/components/Button'

interface MoreSettingButtonProps {
  label: string
  path: string
  icon: LucideIcon
}

export default function MoreSettingButton({ label, path, icon: Icon }: MoreSettingButtonProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(path)
  }

  return (
    <Button
      variant="outline"
      size="lg"
      className="w-full flex items-center justify-between rounded-xl text-sm"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2">
        <Icon className="size-4" />
        {label}
      </div>
      <ChevronRight className="size-5" />
    </Button>
  )
}
