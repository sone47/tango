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
    <button className="bg-muted/50 rounded-xl p-4 text-left" onClick={onClick}>
      <div className="mb-2 flex items-center gap-2">
        <Icon size={16} className="text-primary" />
        <span className={`text-foreground text-sm font-medium`}>{title}</span>
      </div>
      <p className={`text-foreground text-2xl font-bold`}>{value}</p>
      {children}
    </button>
  )
}

export default StatCard
