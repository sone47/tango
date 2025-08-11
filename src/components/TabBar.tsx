import type { LucideIcon } from 'lucide-react'

import type { TabType } from '@/types'

import TabButton from './TabButton'

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
          <TabButton
            key={tab.id}
            id={tab.id}
            icon={tab.icon}
            label={tab.label}
            isActive={activeTab === tab.id}
            onClick={onTabChange}
          />
        ))}
      </div>
    </div>
  )
}

export default Tabs
