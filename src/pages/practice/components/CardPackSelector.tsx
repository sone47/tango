import { BookOpen, ListX } from 'lucide-react'
import { ReactElement, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/Button'
import EmptyWordPack from '@/components/EmptyWordPack'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import Typography from '@/components/Typography'
import { colors, spacing } from '@/constants/styles'
import { useCardPacks } from '@/hooks/useCardPacks'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { useLastestData } from '@/hooks/useLastestData'
import { cn } from '@/lib/utils'
import { cardPackService } from '@/services/cardPackService'
import { practiceService } from '@/services/practiceService'
import { usePracticeStore } from '@/stores/practiceStore'
import { useWordPackStore } from '@/stores/wordPackStore'
import type { CardPack } from '@/types'

const CardPackSelector = () => {
  const navigate = useNavigate()
  const { cardPacks, loading, fetchCardPacks } = useCardPacks()
  const { hasData } = useWordPackStore()
  const { currentWordPack } = useCurrentWordPack()
  const { cardPackId: latestCardPackId } = useLastestData()
  const { showCardPackSelector, updateState } = usePracticeStore()

  useEffect(() => {
    if (showCardPackSelector && currentWordPack) {
      fetchCardPacks(currentWordPack.id)
    }
  }, [showCardPackSelector, currentWordPack])

  const generateCardPackId = (cardPackId: number) => {
    return `card-pack-${cardPackId}`
  }

  const handleSelectWordPack = () => {
    navigate('/wordpack-management')
  }

  const handleCardPackSelect = async (cardPack: CardPack) => {
    const fullCardPack = await cardPackService.getCardPackWithWordsById(cardPack.id)
    if (fullCardPack) {
      await practiceService.createPracticesForWords(fullCardPack.words)

      updateState({
        tempSelectedCardPack: fullCardPack,
        showCardPackSelector: false,
        showCardPackConfig: true,
      })
    }
  }

  let content: ReactElement | null = null

  if (loading) {
    content = (
      <div className="h-64">
        <Loading text="加载卡包中..." size="md" />
      </div>
    )
  }

  if (!content && !hasData) {
    content = <EmptyWordPack showImportButton />
  }

  if (!content && !currentWordPack) {
    content = (
      <>
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
          <ListX className="h-12 w-12 mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">未选择词包</h3>
          <p className="text-sm text-gray-600 text-center">请先选择词包</p>
        </div>
        <Button className="w-full" variant="primary" onClick={handleSelectWordPack}>
          选择词包
        </Button>
      </>
    )
  }

  if (!content) {
    content = (
      <div className={spacing.listItems}>
        {cardPacks.map((cardPack) => (
          <button
            key={cardPack.id}
            id={generateCardPackId(cardPack.id)}
            onClick={() => handleCardPackSelect(cardPack)}
            className={cn(
              'w-full p-4 rounded-2xl border border-blue-100 transition-colors text-left',
              colors.gradients.blue,
              colors.gradients.blueHover,
              cardPack.id === latestCardPackId && 'border-primary border-2'
            )}
          >
            <div className="w-full flex-1 flex items-center justify-between">
              <div>
                <Typography.Title level={6} className="font-semibold">
                  {cardPack.name}
                </Typography.Title>
                <Typography.Text type="secondary" size="sm">
                  {cardPack.words.length} 个词汇
                </Typography.Text>
              </div>
              <Typography.Text type="secondary" size="xs">
                已掌握 {(cardPack.progress * 100).toFixed(2)}%
              </Typography.Text>
            </div>
          </button>
        ))}
      </div>
    )

    if (showCardPackSelector && latestCardPackId) {
      const cardPackId = generateCardPackId(latestCardPackId)
      const cardPackElement = document.getElementById(cardPackId)
      if (cardPackElement) {
        cardPackElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }

  return (
    <Modal
      isOpen={showCardPackSelector}
      onClose={() => updateState({ showCardPackSelector: false })}
      title="选择卡包"
      icon={BookOpen}
      iconColor="blue"
      maxWidth="lg"
    >
      <div className="max-h-96 overflow-y-auto overflow-x-hidden">{content}</div>
    </Modal>
  )
}

export default CardPackSelector
