import WordEditButton from '@/components/tango/WordEditButton'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { cn } from '@/lib/utils'
import { usePracticeStore } from '@/stores/practiceStore'
import { Word } from '@/types'

interface FlashCardHeaderProps {
  currentIndex: number
  totalCount: number
  variant?: 'light' | 'dark'
  className?: string
}

const FlashCardHeader = ({
  currentIndex,
  totalCount,
  variant = 'light',
  className = '',
}: FlashCardHeaderProps) => {
  const baseClasses = 'flex items-center justify-between'
  const variantClasses = {
    light: 'bg-gray-100/80 backdrop-blur-sm text-gray-600',
    dark: 'bg-white/80 backdrop-blur-sm text-gray-600',
  }
  const { updateState, shuffledWords, currentWordIndex } = usePracticeStore()
  const { currentWordPack } = useCurrentWordPack()

  const word = shuffledWords[currentWordIndex]

  const handleEditSuccess = async (updatedWord: Word) => {
    updateState({
      shuffledWords: shuffledWords.map((w) => (w.id === updatedWord.id ? updatedWord : w)),
    })
  }

  return (
    <div className="z-1">
      <div className={cn(baseClasses, className)}>
        <div className={`${variantClasses[variant]} px-3 py-1 rounded-full text-sm font-medium`}>
          {currentIndex + 1}/{totalCount}
        </div>
        <WordEditButton
          wordPackId={currentWordPack?.id || -1}
          word={word}
          onSuccess={handleEditSuccess}
        />
      </div>
    </div>
  )
}

export default FlashCardHeader
