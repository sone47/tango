import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  onClick?: () => void
  children?: ReactNode
}

const StatCard = ({ title, value, icon: Icon, onClick, children }: StatCardProps) => {
  return (
    <button className="bg-muted/50 p-4 rounded-xl text-left" onClick={onClick}>
      <div className="flex items-center gap-2 mb-2">
        <Icon size={16} className="text-primary" />
        <span className={`text-sm font-medium text-foreground`}>{title}</span>
      </div>
      <p className={`text-2xl font-bold text-foreground`}>{value}</p>
      {children}
    </button>
  )
}

export default StatCard
