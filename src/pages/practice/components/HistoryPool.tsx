import { motion } from 'framer-motion'
import { History, Star } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import Modal from '@/components/Modal'
import ProficiencySlider from '@/components/ProficiencySlider'
import { practiceService } from '@/services/practiceService'
import type { Word } from '@/types'

interface HistoryPoolProps {
  isOpen: boolean
  onClose: () => void
  studiedWords: Word[]
}

const HistoryPool = ({ isOpen, onClose, studiedWords }: HistoryPoolProps) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [practiceData, setPracticeData] = useState<Record<number, number>>({})

  const handleOpen = useCallback(async () => {
    if (!isOpen || !studiedWords.length) return

    setCurrentIndex(0)

    const wordIds = studiedWords.map((word) => word.id)
    const practices = await practiceService.getPracticesByVocabularyIds(wordIds)
    const data = Object.fromEntries(
      practices.map((practice) => [practice.vocabularyId, practice.proficiency])
    )
    setPracticeData(data)
  }, [isOpen, studiedWords])

  useEffect(() => {
    handleOpen()
  }, [handleOpen])

  const updateProficiency = (proficiency: number) => {
    setPracticeData((prev) => ({
      ...prev,
      [currentWord?.id]: proficiency,
    }))
  }

  const handleProficiencyChangeComplete = async (proficiency: number) => {
    await practiceService.updatePractice(currentWord?.id, { proficiency })
  }

  const handleSwipe = (direction: 'left' | 'right') => {
    if (direction === 'left' && currentIndex < studiedWords.length - 1) {
      setCurrentIndex(currentIndex + 1)
    } else if (direction === 'right' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const currentWord = studiedWords[currentIndex]

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="历史卡池"
      icon={History}
      iconColor="purple"
      maxWidth="md"
    >
      {studiedWords.length > 0 ? (
        <div className="flex flex-col gap-4">
          {/* 进度指示器 */}
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">
                {currentIndex + 1} / {studiedWords.length}
              </span>
            </div>
          </div>

          {/* 当前卡片 */}
          {currentWord && (
            <motion.div
              key={currentWord.id}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={(_, info) => {
                if (info.offset.x > 100) {
                  handleSwipe('right')
                } else if (info.offset.x < -100) {
                  handleSwipe('left')
                }
              }}
            >
              {/* 音标 */}
              <div className="flex items-center justify-center mb-3">
                <span className="text-xl font-medium text-gray-800">{currentWord.phonetic}</span>
              </div>

              {/* 写法 */}
              <div className="text-center mb-3">
                <span className="text-3xl font-bold text-gray-900">{currentWord.word}</span>
              </div>

              {/* 释义 */}
              <div className="text-center mb-4">
                <span className="text-lg text-gray-700">{currentWord.definition}</span>
              </div>

              {/* 例句 */}
              <div className="bg-white/80 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-2 font-medium">例句:</p>
                {currentWord.example ? (
                  <p className="text-gray-800 leading-relaxed">{currentWord.example}</p>
                ) : (
                  <div className="text-center py-2">
                    <p className="text-gray-500">暂无例句</p>
                    <p className="text-gray-400 text-sm mt-1">该词汇还没有添加例句</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* 熟练度调整 */}
          {currentWord && (
            <div className="bg-gray-50 rounded-2xl p-4">
              <ProficiencySlider
                value={practiceData[currentWord.id] ?? 0}
                onChange={updateProficiency}
                onChangeComplete={handleProficiencyChangeComplete}
                size="md"
              />
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-full mb-4 mx-auto flex items-center justify-center">
            <Star size={24} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">暂无历史记录</h3>
          <p className="text-gray-600">开始练习后，已学习的卡片会出现在这里</p>
        </div>
      )}
    </Modal>
  )
}

export default HistoryPool
