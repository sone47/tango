import { round } from 'lodash'
import { Calendar, Package, TrendingUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

import Card from '@/components/Card'
import { layout } from '@/constants/styles'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { useModalState } from '@/hooks/useModalState'
import StatCard from '@/pages/profile/components/StatCard'
import { practiceService } from '@/services/practiceService'

import TodayStudyModal from './TodayStudyModal'
import WordPackProgressModal from './WordPackProgressModal'

const StudyStats = () => {
  const { currentWordPack } = useCurrentWordPack()
  const [todayPracticeCount, setTodayPracticeCount] = useState(0)
  const [currentWordPackProgress, setCurrentWordPackProgress] = useState(0)
  const [loading, setLoading] = useState(true)
  const [progressLoading, setProgressLoading] = useState(true)

  const todayStudyModal = useModalState()
  const wordPackProgressModal = useModalState()

  const fetchTodayPracticeCount = useCallback(async () => {
    try {
      setLoading(true)

      const todayPractices = await practiceService.getTodayPractices()
      setTodayPracticeCount(todayPractices.length)
    } catch (error) {
      console.error('获取今日练习数量失败:', error)
      setTodayPracticeCount(0)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCurrentWordPackProgress = useCallback(async () => {
    try {
      setProgressLoading(true)

      if (!currentWordPack?.id) {
        setCurrentWordPackProgress(0)
        return
      }

      const progress = await practiceService.calculateWordPackProgress(currentWordPack.id)
      setCurrentWordPackProgress(progress)
    } catch (error) {
      console.error('获取当前词包进度失败:', error)
      setCurrentWordPackProgress(0)
    } finally {
      setProgressLoading(false)
    }
  }, [currentWordPack?.id])

  useEffect(() => {
    fetchTodayPracticeCount()
  }, [fetchTodayPracticeCount])

  useEffect(() => {
    fetchCurrentWordPackProgress()
  }, [fetchCurrentWordPackProgress])

  return (
    <>
      <Card title="学习统计" icon={TrendingUp} iconHasBg>
        <div className={layout.gridCols2}>
          <StatCard
            title="今日学习"
            value={loading ? '-' : todayPracticeCount}
            icon={Calendar}
            onClick={todayStudyModal.open}
          />
          <StatCard
            title="词包进度"
            value={progressLoading ? '-' : `${round(currentWordPackProgress * 100, 2)}%`}
            icon={Package}
            onClick={wordPackProgressModal.open}
          />
        </div>
      </Card>

      <TodayStudyModal isOpen={todayStudyModal.isOpen} onClose={todayStudyModal.close} />
      <WordPackProgressModal
        isOpen={wordPackProgressModal.isOpen}
        onClose={wordPackProgressModal.close}
      />
    </>
  )
}

export default StudyStats
