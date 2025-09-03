import { Settings, Shuffle } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import Button from '@/components/Button'
import Modal from '@/components/Modal'
import ProficiencySlider from '@/components/ProficiencySlider'
import Typography from '@/components/Typography'
import { useLastestData } from '@/hooks/useLastestData'
import { useSettings } from '@/hooks/useSettings'
import { practiceService } from '@/services/practiceService'
import { usePracticeStore } from '@/stores/practiceStore'
import type { Practice } from '@/types'
import { filterWordsByProficiency, processWords } from '@/utils/practiceUtils'

const CardPackConfigModal = () => {
  const navigate = useNavigate()
  const { settings } = useSettings()
  const { setLatestCardPackId } = useLastestData()
  const { showCardPackConfig, updateState, tempSelectedCardPack } = usePracticeStore()

  const [proficiency, setProficiency] = useState(100)
  const [filteredWordsCount, setFilteredWordsCount] = useState(0)
  const [practices, setPractices] = useState<Practice[]>([])
  const [isShuffle, setIsShuffle] = useState(settings.practice.isShuffle)

  const cardPack = useMemo(
    () =>
      tempSelectedCardPack ?? {
        id: 0,
        name: '未选择卡包',
        words: [],
        wordPackId: 0,
      },
    [tempSelectedCardPack]
  )

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

  const handleCardPackConfigConfirm = async (shouldShuffle: boolean, proficiency: number) => {
    const finalWords = processWords(cardPack.words, practices, proficiency, shouldShuffle)

    updateState({
      selectedCardPack: cardPack,
      shuffledWords: finalWords,
      currentWordIndex: 0,
      studiedWords: [],
      tempSelectedCardPack: null,
      showCardPackConfig: false,
      proficiency,
    })

    setLatestCardPackId(cardPack.id)

    setTimeout(() => {
      navigate('/game')
    }, 100)
  }

  const handleCardPackConfigCancel = () => {
    updateState({
      tempSelectedCardPack: null,
      showCardPackConfig: false,
    })
  }

  return (
    <Modal
      isOpen={showCardPackConfig}
      onClose={handleCardPackConfigCancel}
      title="配置卡包"
      icon={Settings}
      iconHasBg
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
            预计学习 {filteredWordsCount} 个单词
          </Typography.Text>
        </div>

        <div className="flex items-center gap-4">
          <Button
            variant="primary"
            onClick={() => handleCardPackConfigConfirm(isShuffle, proficiency)}
            className="flex-1"
            size="lg"
            disabled={!filteredWordsCount}
          >
            开始学习
          </Button>
          <Shuffle
            className="size-7 cursor-pointer"
            color={isShuffle ? 'var(--color-blue-600)' : 'var(--color-gray-400)'}
            onClick={() => setIsShuffle(!isShuffle)}
          />
        </div>
      </div>
    </Modal>
  )
}

export default CardPackConfigModal
