import { motion } from 'framer-motion'

import { PROFILE_ANIMATIONS } from '@/constants/motion'

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
