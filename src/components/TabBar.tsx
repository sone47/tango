import type { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'

import type { TabType } from '@/types'

export interface TabConfig {
  id: TabType
  icon: LucideIcon
  label: string
  path: string
  component: React.ComponentType<unknown>
}

interface TabsProps {
  tabs: TabConfig[]
  activeTab: TabType
  onTabChange: (tab: TabType) => void
  className?: string
}

const Tabs = ({ tabs, activeTab, onTabChange, className = '' }: TabsProps) => {
  return (
    <div className={`bg-background/80 backdrop-blur-lg border-t border-border ${className}`}>
      <div className="flex items-center justify-around py-1 px-4">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
              activeTab === tab.id
                ? 'text-primary'
                : 'text-muted-foreground/80 hover:text-muted-foreground'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <tab.icon size={20} className="mb-0.5" />
            <span className="text-xs font-medium">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default Tabs
