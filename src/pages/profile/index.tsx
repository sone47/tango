import { motion } from 'framer-motion'
import { useEffect } from 'react'

import AnimatedSection, { PROFILE_ANIMATIONS } from './components/AnimatedSection'
import ImportSection from './components/ImportSection'
import ProfileHeader from './components/ProfileHeader'
import StudyStats from './components/StudyStats'
import WordPackManagement from './components/WordPackManagement'

const ProfileTab = () => {
  const viewId = history.state.usr?.view

  useEffect(() => {
    if (viewId) {
      document.getElementById(viewId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [viewId])

  return (
    <motion.div
      className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 relative"
      initial={PROFILE_ANIMATIONS.container.initial}
      animate={PROFILE_ANIMATIONS.container.animate}
      transition={PROFILE_ANIMATIONS.container.transition}
    >
      <motion.div
        className="absolute top-0 left-0 right-0 z-10"
        initial={PROFILE_ANIMATIONS.header.initial}
        animate={PROFILE_ANIMATIONS.header.animate}
        transition={PROFILE_ANIMATIONS.header.transition}
      >
        <ProfileHeader />
      </motion.div>

      <div
        className="h-full overflow-auto p-4 space-y-6 profile-scroll-container"
        style={{
          paddingTop: 80,
        }}
      >
        <div id="stats">
          <AnimatedSection delay={0.08}>
            <StudyStats />
          </AnimatedSection>
        </div>

        <div id="word-pack-management">
          <AnimatedSection delay={0.16}>
            <WordPackManagement />
          </AnimatedSection>
        </div>

        <div id="import">
          <AnimatedSection delay={0.24}>
            <ImportSection />
          </AnimatedSection>
        </div>
      </div>
    </motion.div>
  )
}

export default ProfileTab
