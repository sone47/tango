import { motion } from 'framer-motion'
import { BookOpen, FileX } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/Button'
import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import Typography from '@/components/Typography'
import { colors, spacing } from '@/constants/styles'
import type { CardPack } from '@/types'

interface CardPackSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectCardPack: (cardPack: CardPack) => void
  cardPacks: (CardPack & { progress: number })[]
  loading?: boolean
  hasData?: boolean
}

const CardPackSelector = ({
  isOpen,
  onClose,
  onSelectCardPack,
  cardPacks,
  loading = false,
  hasData = true,
}: CardPackSelectorProps) => {
  const navigate = useNavigate()

  const handleImportRecommendedCardPack = () => {
    navigate('/recommended-packs')
  }

  const handleImportCustomCardPack = () => {
    navigate('/profile', { state: { view: 'import' } })
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
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="h-64">
            <Loading text="加载卡包中..." size="md" />
          </div>
        ) : !hasData || !cardPacks.length ? (
          <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <FileX className="h-12 w-12 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无卡包</h3>
            <p className="text-sm text-gray-600 text-center">
              {!hasData ? '请先导入词包数据' : '没有可用的卡包'}
            </p>
          </div>
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

      {!loading && (!hasData || !cardPacks.length) && (
        <div className="flex flex-col justify-center gap-2">
          <Button variant="primary" onClick={handleImportRecommendedCardPack}>
            导入推荐词包
          </Button>
          <Button variant="secondary" onClick={handleImportCustomCardPack}>
            导入自定义词包
          </Button>
        </div>
      )}
    </Modal>
  )
}

export default CardPackSelector
