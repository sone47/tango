import { Settings, Shuffle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import Button from '@/components/Button'
import Modal from '@/components/Modal'
import ProficiencySlider from '@/components/ProficiencySlider'
import Typography from '@/components/Typography'
import { practiceService } from '@/services/practiceService'
import type { CardPack, Practice } from '@/types'
import { filterWordsByProficiency } from '@/utils/practiceUtils'

interface CardPackConfigModalProps {
  isOpen: boolean
  cardPack: CardPack
  onConfirm: (shouldShuffle: boolean, proficiency: number) => void
  onCancel: () => void
}

const CardPackConfigModal = ({
  isOpen,
  cardPack,
  onConfirm,
  onCancel,
}: CardPackConfigModalProps) => {
  const [proficiency, setProficiency] = useState(100)
  const [filteredWordsCount, setFilteredWordsCount] = useState(0)
  const [practices, setPractices] = useState<Practice[]>([])

  const initData = useCallback(async () => {
    setProficiency(100)

    const vocabularyIds = cardPack.words.map((word) => word.id)
    const practices = await practiceService.getPracticesByVocabularyIds(vocabularyIds)
    setPractices(practices)
  }, [cardPack])

  useEffect(() => {
    initData()
  }, [initData])

  useEffect(() => {
    const count = filterWordsByProficiency(cardPack.words, practices, proficiency).length
    setFilteredWordsCount(count)
  }, [proficiency, cardPack, practices])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="配置卡包"
      icon={Settings}
      iconColor="blue"
      maxWidth="sm"
    >
      <div className="flex flex-col gap-6">
        <Typography.Text type="secondary" size="sm">
          {cardPack.name}
        </Typography.Text>

        <div className="flex flex-col gap-2">
          <Typography.Text type="secondary" size="sm" weight="medium" className="text-gray-700">
            选择熟练度 ≤ {proficiency}% 的单词
          </Typography.Text>
          <div>
            <ProficiencySlider
              value={proficiency}
              onChange={setProficiency}
              showLabel={false}
              showValue={false}
              size="md"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          <Typography.Text type="secondary" size="sm" className="text-gray-500">
            预计学习 {filteredWordsCount} 个词汇
          </Typography.Text>
        </div>

        <div className="space-y-3">
          <Button
            variant="primary"
            onClick={() => onConfirm(false, proficiency)}
            className="w-full"
            disabled={!filteredWordsCount}
          >
            开始学习
          </Button>

          <Button
            variant="primary"
            onClick={() => onConfirm(true, proficiency)}
            icon={Shuffle}
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={!filteredWordsCount}
          >
            洗牌后开始
          </Button>

          <Button variant="secondary" onClick={onCancel} className="w-full">
            取消
          </Button>
        </div>
      </div>
    </Modal>
  )
}

export default CardPackConfigModal
