import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

import AnimatedSection, { PROFILE_ANIMATIONS } from './components/AnimatedSection'
import ImportSection from './components/ImportSection'
import ProfileHeader from './components/ProfileHeader'
import ProgressSection from './components/ProgressSection'
import StudyStats from './components/StudyStats'

const ProfileTab = () => {
  const [scrollProgress, setScrollProgress] = useState(0)

  // 监听滚动进度，同步header状态
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.profile-scroll-container')
      if (scrollContainer) {
        const currentScrollY = scrollContainer.scrollTop
        const maxScroll = 100
        const progress = Math.min(currentScrollY / maxScroll, 1)
        setScrollProgress(progress)
      }
    }

    const scrollContainer = document.querySelector('.profile-scroll-container')
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true })
      return () => scrollContainer.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const dynamicPaddingTop = 64 - 16 * scrollProgress + 16 // (64px -> 48px) + 16px

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

      <motion.div
        className="h-full overflow-auto p-4 space-y-6 profile-scroll-container"
        animate={{
          paddingTop: dynamicPaddingTop,
        }}
        transition={{
          duration: 0.15,
          ease: 'easeOut',
        }}
      >
        <AnimatedSection delay={0.08}>
          <StudyStats />
        </AnimatedSection>

        <AnimatedSection delay={0.16}>
          <ProgressSection />
        </AnimatedSection>

        <AnimatedSection delay={0.24}>
          <ImportSection />
        </AnimatedSection>
      </motion.div>
    </motion.div>
  )
}

export default ProfileTab
