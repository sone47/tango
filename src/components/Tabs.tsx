import { useState } from 'react'

import { Tabs as ShadTabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

interface TabsProps {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  tabs: {
    label: string
    value: string
    component: React.ReactNode
    className?: string
  }[]
  className?: string
  tabListClassName?: string
}

export function Tabs({
  defaultValue,
  value,
  onValueChange,
  tabs,
  className,
  tabListClassName,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(value || defaultValue)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    onValueChange?.(value)
  }

  return (
    <ShadTabs defaultValue={defaultValue} value={value || activeTab} className={className}>
      <TabsList className={cn('w-full', tabListClassName)}>
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} onClick={() => handleTabChange(tab.value)}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className={cn('pt-2', tab.className)}>
          {tab.component}
        </TabsContent>
      ))}
    </ShadTabs>
  )
}
