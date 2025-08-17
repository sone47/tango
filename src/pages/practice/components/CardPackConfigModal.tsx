import { Settings, Shuffle } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import Button from '@/components/Button'
import Modal from '@/components/Modal'
import ProficiencySlider from '@/components/ProficiencySlider'
import Typography from '@/components/Typography'
import { useSettings } from '@/hooks/useSettings'
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
  const { settings } = useSettings()

  const [proficiency, setProficiency] = useState(100)
  const [filteredWordsCount, setFilteredWordsCount] = useState(0)
  const [practices, setPractices] = useState<Practice[]>([])
  const [isShuffle, setIsShuffle] = useState(settings.practice.isShuffle)

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
          <div className="flex flex-col gap-2">
            <ProficiencySlider
              value={proficiency}
              onChange={setProficiency}
              showLabel={false}
              showValue={false}
              size="lg"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>
          <Typography.Text type="secondary" size="sm" className="text-gray-500">
            预计学习 {filteredWordsCount} 个词汇
          </Typography.Text>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            onClick={() => onConfirm(isShuffle, proficiency)}
            className="flex-1"
            disabled={!filteredWordsCount}
          >
            开始学习
          </Button>
          <Shuffle
            className="w-6 h-6 cursor-pointer"
            color={isShuffle ? 'var(--color-blue-600)' : 'var(--color-gray-400)'}
            onClick={() => setIsShuffle(!isShuffle)}
          />
        </div>
      </div>
    </Modal>
  )
}

export default CardPackConfigModal
