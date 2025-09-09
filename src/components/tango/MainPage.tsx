import { BookOpen, User } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router'

import TabBar, { TabConfig } from '@/components/TabBar'
import PracticeTab from '@/pages/practice'
import ProfileTab from '@/pages/profile'
import { TabType } from '@/types'

import Header from './Header'

const MainPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const tabs: TabConfig[] = [
    { id: 'practice', icon: BookOpen, label: '学习', component: PracticeTab, path: '/' },
    { id: 'profile', icon: User, label: '我的', component: ProfileTab, path: '/profile' },
  ]
  const titleMap = {
    practice: '学习',
    profile: '我的数据',
  }

  const getActiveTabFromPath = (pathname: string): TabType => {
    return tabs.find((t) => t.path === pathname)?.id as TabType
  }

  const activeTab = getActiveTabFromPath(location.pathname)

  const handleTabChange = (tab: TabType) => {
    navigate(tabs.find((t) => t.id === tab)?.path || '/', { replace: true })
  }

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || PracticeTab

  return (
    <div className="mobile-safe-area flex h-full flex-col">
      <div className="flex flex-1 flex-col overflow-y-auto">
        <Header title={titleMap[activeTab]} />
        <div className="flex-1 overflow-y-auto p-4">
          <ActiveComponent />
        </div>
      </div>
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}

export default MainPage
