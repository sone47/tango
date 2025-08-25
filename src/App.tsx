import { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'

import NotFound from '@/components/404'
import ErrorDisplay from '@/components/ErrorDisplay'
import Loading from '@/components/Loading'
import { Toaster } from '@/components/ui/sonner'
import { DB_NAME, DB_VERSION } from '@/constants/database'
import { useDatabase } from '@/hooks/useDatabase'
import AdvanceSettings from '@/pages/advance-settings'
import RecommendedPacksPage from '@/pages/recommended-packs'
import SettingsPage from '@/pages/settings'
import SyncPage from '@/pages/sync'
import WordPackManagePage from '@/pages/wordpack-management'

import MainPage from './components/MainPage'

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
        <Route path="/" element={<MainPage />} />
        <Route path="/profile" element={<MainPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster richColors theme="system" position="top-right" mobileOffset={60} />
    </>
  )
}

export default App
