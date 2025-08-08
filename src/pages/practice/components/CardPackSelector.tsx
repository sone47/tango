import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'

import EmptyWordPack from '@/components/EmptyWordPack'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import Typography from '@/components/Typography'
import { colors, spacing } from '@/constants/styles'
import { useWordPackStore } from '@/stores/wordPackStore'
import type { CardPack } from '@/types'

interface CardPackSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectCardPack: (cardPack: CardPack) => void
  cardPacks: (CardPack & { progress: number })[]
  loading?: boolean
}

const CardPackSelector = ({
  isOpen,
  onClose,
  onSelectCardPack,
  cardPacks,
  loading = false,
}: CardPackSelectorProps) => {
  const { hasData } = useWordPackStore()

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="选择卡包"
      icon={BookOpen}
      iconColor="blue"
      maxWidth="lg"
    >
      <div className="max-h-96 overflow-y-auto overflow-x-hidden">
        {loading ? (
          <div className="h-64">
            <Loading text="加载卡包中..." size="md" />
          </div>
        ) : !hasData ? (
          <EmptyWordPack showImportButton />
        ) : (
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
        )}
      </div>
    </Modal>
  )
}

export default CardPackSelector
