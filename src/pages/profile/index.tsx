import { motion } from 'framer-motion'

import AnimatedSection, { PROFILE_ANIMATIONS } from './components/AnimatedSection'
import ImportSection from './components/ImportSection'
import ProfileHeader from './components/ProfileHeader'
import WordPackManagement from './components/WordPackManagement'
import StudyStats from './components/StudyStats'

const ProfileTab = () => {
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
        <AnimatedSection delay={0.08}>
          <StudyStats />
        </AnimatedSection>

        <AnimatedSection delay={0.16}>
          <WordPackManagement />
        </AnimatedSection>

        <AnimatedSection delay={0.24}>
          <ImportSection />
        </AnimatedSection>
      </div>
    </motion.div>
  )
}

export default ProfileTab
