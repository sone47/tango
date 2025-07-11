import { BookOpen, Package } from 'lucide-react'
import { useEffect, useState } from 'react'

import Loading from '@/components/Loading'
import Modal from '@/components/Modal'
import { baseStyles, colors, spacing } from '@/constants/styles'
import { useCurrentWordPack } from '@/hooks/useCurrentWordPack'
import { practiceService } from '@/services/practiceService'
import type { WordPack } from '@/types'

interface WordPackProgressData {
  wordPack: WordPack
  progress: number
  totalWords: number
}

interface WordPackProgressModalProps {
  isOpen: boolean
  onClose: () => void
}

const WordPackProgressModal = ({ isOpen, onClose }: WordPackProgressModalProps) => {
  const { allWordPacks } = useCurrentWordPack()
  const [progressData, setProgressData] = useState<WordPackProgressData[]>([])
  const [loading, setLoading] = useState(false)

  // 计算词包总词汇数量
  const getWordPackWordCount = (wordPack: WordPack): number => {
    return (
      wordPack.cardPacks?.reduce((total, cardPack) => {
        return total + (cardPack.words?.length || 0)
      }, 0) || 0
    )
  }

  // 获取词包进度数据
  const fetchWordPackProgress = async () => {
    try {
      setLoading(true)

      const progressPromises = allWordPacks.map(async (wordPack) => {
        const progress = await practiceService.calculateWordPackProgress(wordPack.id!)
        const totalWords = getWordPackWordCount(wordPack)

        return {
          wordPack,
          progress,
          totalWords,
        }
      })

      const results = await Promise.all(progressPromises)
      setProgressData(results.sort((a, b) => b.progress - a.progress)) // 按进度降序排列
    } catch (error) {
      console.error('获取词包进度失败:', error)
      setProgressData([])
    } finally {
      setLoading(false)
    }
  }

  // 当模态框打开时获取数据
  useEffect(() => {
    if (!isOpen || !allWordPacks.length) return

    fetchWordPackProgress()
  }, [isOpen, allWordPacks])

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="词包学习进度"
      icon={Package}
      iconColor="purple"
      maxWidth="lg"
    >
      <div className="max-h-96 overflow-y-auto">
        {loading ? (
          <div className="h-64">
            <Loading text="加载进度中..." size="md" />
          </div>
        ) : progressData.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无词包</h3>
            <p className="text-sm text-gray-600">请先导入词包数据</p>
          </div>
        ) : (
          <div className={spacing.listItems}>
            {progressData.map((item) => (
              <div
                key={item.wordPack.id}
                className={`p-4 rounded-2xl border border-gray-200 ${colors.gradients.blue} transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className={`${baseStyles.iconContainer} ${colors.icon.purple}`}>
                      <BookOpen size={20} />
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">{item.wordPack.name}</h3>
                  </div>
                </div>

                {/* 进度条 */}
                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span>学习进度</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(item.progress, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center text-sm text-gray-600">
        {loading
          ? '正在计算学习进度...'
          : progressData.length === 0
            ? '请先导入词包数据'
            : `共 ${progressData.length} 个词包`}
      </div>
    </Modal>
  )
}

export default WordPackProgressModal
