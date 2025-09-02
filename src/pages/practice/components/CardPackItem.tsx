import { Book, BookOpen, BookOpenCheck } from 'lucide-react'
import { useEffect, useRef } from 'react'

import Typography from '@/components/Typography'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { cardPackService } from '@/services/cardPackService'
import { practiceService } from '@/services/practiceService'
import { usePracticeStore } from '@/stores/practiceStore'
import type { CardPack, Word } from '@/types'

interface CardPackItemProps {
  cardPack: CardPack & { progress: number }
  isActive?: boolean
}

const WordCard = ({ word }: { word: Word }) => {
  return (
    <div className="w-[48px] h-[64px] p-2 bg-background text-muted-foreground flex items-center justify-center text-xs rounded-md shadow-lg">
      {word.word}
    </div>
  )
}

const CardPackItem = ({ cardPack, isActive = false }: CardPackItemProps) => {
  const { updateState } = usePracticeStore()
  const cardPackItemRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && cardPackItemRef.current) {
      let scrollContainer: HTMLElement | null = null
      let parent = cardPackItemRef.current.parentElement

      while (parent && parent !== document.body) {
        const style = getComputedStyle(parent)
        if (
          style.overflow === 'auto' ||
          style.overflowY === 'auto' ||
          style.overflow === 'scroll' ||
          style.overflowY === 'scroll'
        ) {
          scrollContainer = parent
          break
        }

        parent = parent.parentElement
      }

      if (scrollContainer) {
        const targetScrollTop = cardPackItemRef.current.offsetTop - scrollContainer.offsetTop - 32

        scrollContainer.scrollTo({
          top: targetScrollTop,
          behavior: 'smooth',
        })
      }
    }
  }, [isActive])

  const handleCardPackClick = async () => {
    const fullCardPack = await cardPackService.getCardPackWithWordsById(cardPack.id)
    if (fullCardPack) {
      await practiceService.createPracticesForWords(fullCardPack.words)

      updateState({
        tempSelectedCardPack: fullCardPack,
        showCardPackConfig: true,
      })
    }
  }

  const TitleIcon = cardPack.progress ? (cardPack.progress === 1 ? BookOpenCheck : BookOpen) : Book
  const displayedWords = cardPack.words.filter((word) => word.word.length <= 2).slice(0, 3)

  return (
    <div
      ref={cardPackItemRef}
      className="relative w-full flex flex-col gap-3 p-4 bg-background/70 rounded-2xl cursor-pointer"
      onClick={handleCardPackClick}
    >
      {isActive && (
        <div
          className="absolute rounded-2xl top-0 left-0 w-full h-full custom-animate-ping opacity-50"
          style={{ '--custom-ping-color': 'var(--primary)' } as React.CSSProperties}
        />
      )}
      <div className="flex items-start gap-2">
        <div className="size-8 bg-muted p-2 rounded-md flex items-center justify-center">
          <TitleIcon className="text-primary" />
        </div>
        <div className="flex-1 flex flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Typography.Title level={5} className="font-semibold max-w-40 truncate">
              {cardPack.name}
            </Typography.Title>
            <div className="flex items-center gap-3">
              <Typography.Text type="secondary" size="xs">
                {cardPack.words.length} 个单词
              </Typography.Text>
              <Typography.Text
                type="secondary"
                size="xs"
                className="text-muted-foreground bg-muted px-2 rounded-sm"
              >
                {(cardPack.progress * 100).toFixed(2)}%
              </Typography.Text>
            </div>
          </div>
          <Progress value={cardPack.progress * 100} />
        </div>
      </div>

      <div className="absolute top-0 right-0 -translate-y-1/3 flex gap-2">
        {displayedWords.map((word, index) => (
          <div
            key={index}
            className={cn(
              index === 0 && 'z-0 -rotate-30 translate-x-1/3 translate-y-[5px]',
              index === 1 && 'z-1',
              index === 2 && 'z-2 rotate-30 -translate-x-1/3 translate-y-[5px]'
            )}
          >
            <WordCard key={word.id} word={word} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CardPackItem
