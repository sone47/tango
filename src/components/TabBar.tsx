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
    <div className={`bg-white/80 backdrop-blur-lg border-t border-gray-200/50 ${className}`}>
      <div className="flex items-center justify-around py-1 px-4">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
              activeTab === tab.id ? 'text-primary' : 'text-gray-500 hover:text-gray-700'
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
