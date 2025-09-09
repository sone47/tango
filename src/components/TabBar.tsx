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
    <div className={`bg-card border-border border-t backdrop-blur-lg ${className}`}>
      <div className="flex items-center justify-around py-3">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === tab.id
                ? 'text-primary font-semibold'
                : 'text-muted-foreground/80 hover:text-muted-foreground hover:scale-105 hover:font-semibold'
            }`}
            whileTap={{ scale: 0.95 }}
          >
            <tab.icon size={20} />
            <span className="text-xs">{tab.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

export default Tabs
