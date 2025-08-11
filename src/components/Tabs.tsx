import { useState } from 'react'

import { Tabs as ShadTabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import Card from './Card'

interface TabsProps {
  defaultValue?: string
  tabs: {
    label: string
    value: string
    component: React.ReactNode
  }[]
  isContentWrapper?: boolean
}

export function Tabs({ defaultValue, tabs, isContentWrapper = true }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  const contents = tabs.map((tab) => (
    <TabsContent key={tab.value} value={tab.value} className="py-2">
      {tab.component}
    </TabsContent>
  ))

  return (
    <ShadTabs defaultValue={defaultValue} value={activeTab}>
      <TabsList className="w-full">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value} onClick={() => handleTabChange(tab.value)}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {isContentWrapper ? <Card>{contents}</Card> : contents}
    </ShadTabs>
  )
}
