import { Package } from 'lucide-react'
import { motion } from 'motion/react'

import { baseStyles, colors } from '@/constants/styles'
import type { WordPack } from '@/types'
import { toLocaleDateString } from '@/utils/date'

interface WordPackItemProps {
  wordPack: WordPack
  isSelected?: boolean
  onClick?: (wordPack: WordPack) => void
  showSelectedBadge?: boolean
}

const WordPackItem = ({
  wordPack,
  isSelected,
  onClick,
  showSelectedBadge = false,
}: WordPackItemProps) => {
  return (
    <motion.button
      onClick={() => onClick?.(wordPack)}
      className={`w-full p-4 rounded-2xl text-left transition-all ${
        isSelected
          ? `${colors.gradients.blueActive} border-2 border-blue-300 shadow-lg`
          : `${colors.gradients.blue} border border-gray-200 ${colors.gradients.blueHover}`
      }`}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`${baseStyles.iconContainer} ${colors.icon.purple}`}>
            <Package size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{wordPack.name}</h3>
            <p className="text-sm text-gray-600">
              创建时间: {wordPack.createdAt ? toLocaleDateString(wordPack.createdAt) : '未知'}
            </p>
          </div>
        </div>
        {isSelected && showSelectedBadge && (
          <div className="text-blue-600 text-sm font-medium">当前词包</div>
        )}
      </div>
    </motion.button>
  )
}

export default WordPackItem
