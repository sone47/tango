import { useEffect } from 'react'

import { useWordPackStore } from '@/stores/wordPackStore'

import ImportSection from './components/ImportSection'
import ProfileHeader from './components/ProfileHeader'
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
      <div className="fixed w-full top-0 z-1">
        <ProfileHeader />
      </div>

      <div
        className="h-full overflow-auto p-4 space-y-6 profile-scroll-container"
        style={{
          paddingTop: 72,
        }}
      >
        <div id="stats">
          <StudyStats />
        </div>

        <div id="word-pack-management">
          <WordPackManagement />
        </div>

        <div id="import">
          <ImportSection />
        </div>
      </div>
    </div>
  )
}

export default ProfileTab
