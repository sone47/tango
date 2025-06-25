import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

const ProfileHeader = () => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

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

  // 计算动态值
  const heightValue = 64 - 16 * scrollProgress // 64px -> 48px
  const fontScale = 1 - 0.2 * scrollProgress // 1.0 -> 0.8
  const opacityValue = 0.7 + 0.25 * scrollProgress // 0.7 -> 0.95

  const justifyContent = scrollProgress > 0.5 ? 'center' : 'flex-start'

  return (
    <motion.div
      ref={containerRef}
      className="w-full flex items-center bg-white/70 backdrop-blur-sm"
      animate={{
        height: heightValue,
        backgroundColor: `rgba(255, 255, 255, ${opacityValue})`,
        paddingLeft: 24,
        paddingRight: 24,
        justifyContent,
      }}
      transition={{
        duration: 0.15,
        ease: 'easeOut',
      }}
    >
      <motion.h1
        className="font-bold text-gray-900 tracking-tight text-2xl transition-transform duration-200 ease-out"
        animate={{
          scale: fontScale,
          x: scrollProgress > 0.3 ? '0%' : '0%', // 使用CSS justifyContent处理水平居中
        }}
        transition={{
          duration: 0.15,
          ease: 'easeOut',
        }}
        style={{
          transformOrigin: scrollProgress > 0.3 ? 'center' : 'left center',
        }}
      >
        我的学习
      </motion.h1>
    </motion.div>
  )
}

export default ProfileHeader
