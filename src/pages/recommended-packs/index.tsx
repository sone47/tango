import { Download, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import Button from '@/components/Button'
import Loading from '@/components/Loading'
import Page from '@/components/Page'
import Typography from '@/components/Typography'
import { recommendedPackService } from '@/services/recommendedPackService'
import { wordPackService } from '@/services/wordPackService'
import type { RecommendedPack } from '@/types'

import CustomWordPack from './components/CustomWordPack'
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
      const importResult = await wordPackService.importFromExcel(file, pack.name, pack.language)

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
        <div className="py-8 text-center text-gray-500">
          <Star className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">暂无推荐词包</h3>
          <p className="text-sm text-gray-600">请稍后再试</p>
        </div>
      )
    }

    return (
      <div className="h-full space-y-3 overflow-y-auto">
        {recommendedPacks.map((pack, index) => (
          <div
            key={index}
            className="bg-card flex items-start justify-between gap-3 rounded-xl border-1 p-4"
          >
            <div className="flex-1">
              <Typography.Title level={6} className="truncate">
                {pack.name}
              </Typography.Title>
              <Typography.Text type="secondary" size="sm">
                {pack.description}
              </Typography.Text>
              <Typography.Text className="text-muted-foreground" size="xs">
                作者: {pack.author}
              </Typography.Text>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => handleImportPack(pack, index)}
              disabled={importingIndex === index}
              loading={importingIndex === index}
              icon={Download}
              className="shrink-0"
              round
            >
              导入
            </Button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <Page
      title={
        <>
          词包库
          <div className="absolute top-1/2 right-4 -translate-y-1/2">
            <CustomWordPack />
          </div>
        </>
      }
    >
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
