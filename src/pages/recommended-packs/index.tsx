import { motion } from 'framer-motion'
import { Download, Star } from 'lucide-react'
import { useEffect, useState } from 'react'

import Button from '@/components/Button'
import Loading from '@/components/Loading'
import NavBar from '@/components/NavBar'
import toast from '@/components/Toast'
import Typography from '@/components/Typography'
import { colors } from '@/constants/styles'
import { recommendedPackService } from '@/services/recommendedPackService'
import { wordPackService } from '@/services/wordPackService'
import type { RecommendedPack } from '@/types'

const RecommendedPacksPage = () => {
  const [recommendedPacks, setRecommendedPacks] = useState<RecommendedPack[]>([])
  const [loading, setLoading] = useState(true)
  const [importingIndex, setImportingIndex] = useState<number | null>(null)

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
    let hideLoading: (() => void) | null = null

    try {
      setImportingIndex(index)
      hideLoading = toast.loading(`正在导入「${pack.name}」...`)

      const file = await recommendedPackService.downloadRecommendedPack(pack)
      const importResult = await wordPackService.importFromExcel(file, pack.name)

      if (importResult.success) {
        toast.success(`🎉 「${pack.name}」导入成功！`)
      } else {
        throw new Error(importResult.message)
      }
    } catch (error) {
      console.error('导入推荐词包失败:', error)
      toast.error('导入失败')
    } finally {
      hideLoading?.()
      setImportingIndex(null)
    }
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
      <div className="space-y-3">
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
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      <NavBar title="推荐词包" />

      <div className="flex-1 overflow-y-auto p-4">{renderContent()}</div>
    </div>
  )
}

export default RecommendedPacksPage
