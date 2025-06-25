import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'

import type { TabType } from '@/types'

interface TabButtonProps {
  id: TabType
  icon: LucideIcon
  label: string
  isActive: boolean
  onClick: (id: TabType) => void
}

const TabButton = ({ id, icon: Icon, label, isActive, onClick }: TabButtonProps) => {
  return (
    <motion.button
      onClick={() => onClick(id)}
      className={`flex flex-col items-center justify-center p-2 rounded-xl transition-colors ${
        isActive ? 'text-primary-600 bg-primary-50' : 'text-gray-500 hover:text-gray-700'
      }`}
      whileTap={{ scale: 0.95 }}
    >
      <Icon size={20} className="mb-0.5" />
      <span className="text-xs font-medium">{label}</span>
    </motion.button>
  )
}

export default TabButton
