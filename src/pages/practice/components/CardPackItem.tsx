import { Book, BookOpen, BookOpenCheck } from 'lucide-react'
import { useEffect, useRef } from 'react'

import Typography from '@/components/Typography'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import { cardPackService } from '@/services/cardPackService'
import { practiceService } from '@/services/practiceService'
import { usePracticeStore } from '@/stores/practiceStore'
import type { CardPack, Word } from '@/types'
import AlertDialog, { useAlertDialog } from '@/components/AlertDialog'
import { useNavigate } from 'react-router'

interface CardPackItemProps {
  cardPack: CardPack & { progress: number }
  isActive?: boolean
}

const WordCard = ({ word }: { word: Word }) => {
  return (
    <div className="bg-card text-muted-foreground flex h-[64px] w-[48px] items-center justify-center rounded-md p-2 text-xs shadow-lg">
      {word.word}
    </div>
  )
}

const CardPackItem = ({ cardPack, isActive = false }: CardPackItemProps) => {
  const { updateState } = usePracticeStore()
  const alertDialog = useAlertDialog()
  const navigator = useNavigate()

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
    if (!fullCardPack?.words.length) {
      alertDialog.show()
      return
    }

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
      className="bg-card/70 relative flex w-full cursor-pointer flex-col gap-3 rounded-2xl border-1 p-4"
      onClick={handleCardPackClick}
    >
      {isActive && (
        <div
          className="custom-animate-ping absolute top-0 left-0 h-full w-full rounded-2xl opacity-50"
          style={{ '--custom-ping-color': 'var(--primary)' } as React.CSSProperties}
        />
      )}
      <div className="flex items-start gap-2">
        <div className="bg-background flex size-8 items-center justify-center rounded-md p-2">
          <TitleIcon className="text-primary" />
        </div>
        <div className="flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-1">
            <Typography.Title level={5} className="max-w-40 truncate font-semibold">
              {cardPack.name}
            </Typography.Title>
            <div className="flex items-center gap-3">
              <Typography.Text type="secondary" size="xs">
                {cardPack.words.length} 个单词
              </Typography.Text>
              <Typography.Text
                type="secondary"
                size="xs"
                className="text-muted-foreground bg-muted rounded-sm px-2"
              >
                {(cardPack.progress * 100).toFixed(2)}%
              </Typography.Text>
            </div>
          </div>
          <Progress value={cardPack.progress * 100} />
        </div>
      </div>

      <div className="absolute top-0 right-0 flex -translate-y-1/3 gap-2">
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

      <div onClick={(e) => e.stopPropagation()}>
        <AlertDialog
          open={alertDialog.isOpen}
          onOpenChange={alertDialog.setIsOpen}
          title="该卡包无法学习"
          description="当前卡包中无卡片，请先往卡包中添加卡片"
          confirmText="添加卡片"
          onConfirm={() => {
            navigator(`/wordpack/${cardPack.wordPackId}`, {
              state: { action: 'add-card', cardPackId: cardPack.id },
            })
          }}
        ></AlertDialog>
      </div>
    </div>
  )
}

export default CardPackItem
