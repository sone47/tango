import { Download, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Card from '@/components/Card'
import Loading from '@/components/Loading'
import Page from '@/components/Page'
import Typography from '@/components/Typography'
import { colors } from '@/constants/styles'
import { recommendedPackService } from '@/services/recommendedPackService'
import { wordPackService } from '@/services/wordPackService'
import type { RecommendedPack } from '@/types'

import SuccessModal from './components/SuccessModal'

const RecommendedPacksPage = () => {
  const [recommendedPacks, setRecommendedPacks] = useState<RecommendedPack[]>([])
  const [loading, setLoading] = useState(true)
  const [importingIndex, setImportingIndex] = useState<number | null>(null)
  const [successImportedModalOpen, setSuccessImportedModalOpen] = useState(false)
  const [successImportedWordPackId, setSuccessImportedWordPackId] = useState<number>()

  useEffect(() => {
    loadRecommendedPacks()
  }, [])

  const loadRecommendedPacks = async () => {
    setLoading(true)
    try {
      const packs = await recommendedPackService.getRecommendedPacks()
      setRecommendedPacks(packs)
    } catch (error) {
      console.error('获取推荐词包失败:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImportPack = async (pack: RecommendedPack, index: number) => {
    try {
      setImportingIndex(index)

      const file = await recommendedPackService.downloadRecommendedPack(pack)
      const importResult = await wordPackService.importFromExcel(file, pack.name)

      if (importResult.success) {
        setSuccessImportedModalOpen(true)
        setSuccessImportedWordPackId(importResult.wordPackId!)
      } else {
        throw new Error(importResult.message)
      }
    } catch (error) {
      console.error('导入失败:', error)
      toast.error('导入失败', {
        description: error instanceof Error ? error.message : '未知错误',
      })
    } finally {
      setImportingIndex(null)
    }
  }

  const handleCloseSuccessImportedModal = () => {
    setSuccessImportedModalOpen(false)
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="h-96">
          <Loading text="加载推荐词包中..." size="md" />
        </div>
      )
    }

    if (!recommendedPacks.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          <Star className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无推荐词包</h3>
          <p className="text-sm text-gray-600">请稍后再试</p>
        </div>
      )
    }

    return (
      <Card className="h-full overflow-y-auto" contentClassName="space-y-3">
        {recommendedPacks.map((pack, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: index * 0.08,
              type: 'spring',
              stiffness: 400,
              damping: 17,
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`${colors.gradients.blue} border border-blue-100 rounded-xl p-4`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Typography.Title level={6} className="truncate">
                  {pack.name}
                </Typography.Title>
                <Typography.Text type="secondary" size="sm">
                  {pack.description}
                </Typography.Text>
                <div className="text-xs text-gray-500 mt-2">作者: {pack.author}</div>
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => handleImportPack(pack, index)}
                disabled={importingIndex === index}
                loading={importingIndex === index}
                icon={Download}
                className="flex-shrink-0"
              >
                导入
              </Button>
            </div>
          </motion.div>
        ))}
      </Card>
    )
  }

  return (
    <Page title="词包库">
      {renderContent()}
      <SuccessModal
        isOpen={successImportedModalOpen}
        onClose={handleCloseSuccessImportedModal}
        importedWordPackId={successImportedWordPackId}
      />
    </Page>
  )
}

export default RecommendedPacksPage
