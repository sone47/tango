import { colors } from '@/constants/styles'
import { cn } from '@/lib/utils'
import type { WordPack } from '@/types'
import { toLocaleDateString } from '@/utils/date'

interface WordPackItemProps {
  wordPack: WordPack
  isSelected?: boolean
  showSelectedBadge?: boolean
  className?: string
}

const WordPackItem = ({ wordPack, isSelected, className }: WordPackItemProps) => {
  return (
    <div
      className={cn(
        'flex items-center justify-between w-full p-4 rounded-2xl text-left',
        isSelected
          ? `${colors.gradients.blueActive} border-2 border-primary shadow-lg`
          : `${colors.gradients.blue} border border-secondary ${colors.gradients.blueHover}`,
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div>
          <h3 className="font-semibold text-secondary-foreground">{wordPack.name}</h3>
          <p className="text-sm text-muted-foreground">
            创建时间: {wordPack.createdAt ? toLocaleDateString(wordPack.createdAt) : '未知'}
          </p>
        </div>
      </div>
      {isSelected && <div className="text-primary text-sm font-medium">当前词包</div>}
    </div>
  )
}

export default WordPackItem
