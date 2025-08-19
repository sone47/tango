import { BookOpen, ListX } from 'lucide-react'
import { motion } from 'motion/react'
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
import { useWordPackStore } from '@/stores/wordPackStore'
import type { CardPack } from '@/types'

interface CardPackSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectCardPack: (cardPack: CardPack) => void
}

const CardPackSelector = ({ isOpen, onClose, onSelectCardPack }: CardPackSelectorProps) => {
  const navigate = useNavigate()
  const { cardPacks, loading, fetchCardPacks } = useCardPacks()
  const { hasData } = useWordPackStore()
  const { currentWordPack } = useCurrentWordPack()

  useEffect(() => {
    if (isOpen && currentWordPack) {
      fetchCardPacks(currentWordPack.id)
    }
  }, [isOpen, currentWordPack])

  const handleSelectWordPack = () => {
    navigate('/wordpack-management')
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
          <motion.button
            key={cardPack.id}
            onClick={() => onSelectCardPack(cardPack)}
            className={`w-full p-4 ${colors.gradients.blue} rounded-2xl border border-blue-100 ${colors.gradients.blueHover} transition-colors text-left`}
            initial={{ opacity: 0, x: -20 }}
            viewport={{ once: true }}
            whileInView={{ opacity: 1, x: 0, transition: { delay: 0.1 } }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="w-full">
              <div className="flex-1 flex items-center justify-between">
                <div>
                  <Typography.Title level={6} className="font-semibold">
                    {cardPack.name}
                  </Typography.Title>
                  <Typography.Text type="secondary" size="sm">
                    {cardPack.words.length} 个词汇
                  </Typography.Text>
                </div>
                <div>
                  <Typography.Text type="secondary" size="xs">
                    已掌握 {(cardPack.progress * 100).toFixed(2)}%
                  </Typography.Text>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    )
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
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
