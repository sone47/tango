import { BookOpen, User } from 'lucide-react'
import { useEffect } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'

import NotFound from '@/components/404'
import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import TabBar, { type TabConfig } from '@/components/TabBar'
import { Toaster } from '@/components/ui/sonner'
import { DB_NAME, DB_VERSION } from '@/constants/database'
import { useDatabase } from '@/hooks/useDatabase'
import AdvanceSettings from '@/pages/advance-settings'
import PracticeTab from '@/pages/practice'
import ProfileTab from '@/pages/profile'
import RecommendedPacksPage from '@/pages/recommended-packs'
import SettingsPage from '@/pages/settings'
import SyncPage from '@/pages/sync'
import WordPackManagePage from '@/pages/wordpack-management'
import type { TabType } from '@/types'

function MainApp() {
  const location = useLocation()
  const navigate = useNavigate()

  const tabs: TabConfig[] = [
    { id: 'practice', icon: BookOpen, label: '学习', component: PracticeTab, path: '/' },
    { id: 'profile', icon: User, label: '我的', component: ProfileTab, path: '/profile' },
  ]

  const getActiveTabFromPath = (pathname: string): TabType => {
    return tabs.find((t) => t.path === pathname)?.id as TabType
  }

  const activeTab = getActiveTabFromPath(location.pathname)

  const handleTabChange = (tab: TabType) => {
    navigate(tabs.find((t) => t.id === tab)?.path || '/')
  }

  const ActiveComponent = tabs.find((t) => t.id === activeTab)?.component || PracticeTab

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col mobile-safe-area">
      <div className="flex-1 overflow-hidden">
        <ActiveComponent />
      </div>
      <TabBar tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  )
}

function App() {
  const { init, isInitializing, error, retry } = useDatabase(DB_NAME, DB_VERSION)

  useEffect(() => {
    init()
  }, [init])

  if (isInitializing) {
    return (
      <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100">
        <Loading text="加载中..." />
      </div>
    )
  }

  if (error) {
    return <ErrorDisplay title="加载失败" onRetry={retry} />
  }

  return (
    <>
      <Routes>
        <Route path="/wordpack-management" element={<WordPackManagePage />} />
        <Route path="/recommended-packs" element={<RecommendedPacksPage />} />
        <Route path="settings">
          <Route path="" element={<SettingsPage />} />
          <Route path="advanced" element={<AdvanceSettings />} />
        </Route>
        <Route path="/sync" element={<SyncPage />} />
        <Route path="/" element={<MainApp />} />
        <Route path="/profile" element={<MainApp />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors theme="system" position="top-right" mobileOffset={60} />
    </>
  )
}

export default App
