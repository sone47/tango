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
    <div className="space-y-6">
      <StudyStats />
      <WordPackManagement />
    </div>
  )
}

export default ProfileTab
