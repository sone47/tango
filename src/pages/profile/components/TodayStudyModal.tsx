import { Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'

import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import ProficiencyBadge from '@/components/ProficiencyBadge'
import { practiceService } from '@/services/practiceService'
import { vocabularyService } from '@/services/vocabularyService'
import type { Practice, Word } from '@/types'
import { format } from '@/utils/date'

interface TodayStudyModalProps {
  isOpen: boolean
  onClose: () => void
}

const TodayStudyModal = ({ isOpen, onClose }: TodayStudyModalProps) => {
  const [todayStudy, setTodayStudy] = useState<
    Array<{ practice: Practice; word: Word | undefined }>
  >([])
  const [loading, setLoading] = useState(false)

  // 获取今日学习详细数据（包含词汇信息）
  const fetchTodayStudyDetails = async () => {
    try {
      setLoading(true)

      const todayPractices = await practiceService.getTodayPractices()

      if (todayPractices.length === 0) {
        setTodayStudy([])
        return
      }

      // 获取对应的词汇信息
      const vocabularyIds = todayPractices.map((practice) => practice.vocabularyId)
      const vocabularies = await vocabularyService.getVocabulariesByIds(vocabularyIds)

      // 组合练习记录和词汇信息
      const todayStudyData = todayPractices.map((practice) => {
        const word = vocabularies.find((vocab) => vocab.id === practice.vocabularyId)
        return { practice, word }
      })

      setTodayStudy(todayStudyData)
    } catch (error) {
      console.error('获取今日学习详细数据失败:', error)
      setTodayStudy([])
    } finally {
      setLoading(false)
    }
  }

  // 当模态框打开时获取数据
  useEffect(() => {
    if (!isOpen) return

    fetchTodayStudyDetails()
  }, [isOpen])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="今日学习"
      icon={Calendar}
      iconColor="blue"
      maxWidth="md"
      className="max-h-[80vh]"
    >
      <div className="overflow-auto max-h-96">
        {loading ? (
          <div className="h-64">
            <Loading text="正在加载学习记录..." size="md" />
          </div>
        ) : todayStudy.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <p className="text-gray-500">今天还没有学习记录</p>
            <p className="text-sm text-gray-400 mt-1">快去学习吧～</p>
          </div>
        ) : (
          <div className="space-y-3">
            {todayStudy.map(({ practice, word }) => (
              <div key={practice.vocabularyId} className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{word!.word}</h4>
                  <ProficiencyBadge proficiency={practice.proficiency} size="sm" />
                </div>
                <p className="text-sm text-gray-600 mb-1">{word!.phonetic}</p>
                <p className="text-sm text-gray-700 mb-2">{word!.definition}</p>
                <p className="text-xs text-gray-500 flex justify-between">
                  <span>练习次数: {practice.practiceCount} 次</span>
                  <span>最后练习: {format(practice.lastPracticeTime)}</span>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  )
}

export default TodayStudyModal
