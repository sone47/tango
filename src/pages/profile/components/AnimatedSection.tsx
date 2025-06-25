import { motion } from 'framer-motion'

// 动画配置常量
export const PROFILE_ANIMATIONS = {
  container: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
      duration: 0.3,
    },
  },
  header: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
      delay: 0.05,
    },
  },
  section: {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 17,
    },
  },
} as const

interface AnimatedSectionProps {
  children: React.ReactNode
  delay: number
}

const AnimatedSection = ({ children, delay }: AnimatedSectionProps) => (
  <motion.div
    initial={PROFILE_ANIMATIONS.section.initial}
    animate={PROFILE_ANIMATIONS.section.animate}
    transition={{ ...PROFILE_ANIMATIONS.section.transition, delay }}
  >
    {children}
  </motion.div>
)

export default AnimatedSection
