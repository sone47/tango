import { useEffect } from 'react'

import { useWordPackStore } from '@/stores/wordPackStore'

import StudyStats from './components/StudyStats'
import WordPackManagement from './components/WordPackManagement'

const ProfileTab = () => {
  const viewId = history.state.usr?.view
  const { fetchWordPacks } = useWordPackStore()

  useEffect(() => {
    fetchWordPacks()
  }, [])

  useEffect(() => {
    if (viewId) {
      document.getElementById(viewId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [viewId])

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="h-full overflow-auto p-4 space-y-6 profile-scroll-container">
        <StudyStats />
        <WordPackManagement />
      </div>
    </div>
  )
}

export default ProfileTab
