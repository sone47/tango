import { motion } from 'framer-motion'
import { BookOpen, FileX } from 'lucide-react'

import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import Typography from '@/components/Typography'
import { baseStyles, colors, spacing } from '@/constants/styles'
import type { CardPack } from '@/types'

interface CardPackSelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectCardPack: (cardPack: CardPack) => void
  cardPacks: CardPack[]
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
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`${baseStyles.iconContainerLarge} ${colors.icon.blue}`}>
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <Typography.Title level={6} className="font-semibold">
                        {cardPack.name}
                      </Typography.Title>
                      <Typography.Text type="secondary" size="sm">
                        {cardPack.words.length} 个词汇
                      </Typography.Text>
                    </div>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      <Typography.Text
        type="secondary"
        size="sm"
        className="block mt-6 p-4 bg-gray-50 rounded-xl text-center"
      >
        {loading
          ? '正在加载卡包列表...'
          : !hasData || !cardPacks.length
            ? '请先导入词包数据'
            : '选择一个卡包开始练习'}
      </Typography.Text>
    </Modal>
  )
}

export default CardPackSelector
