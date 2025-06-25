import type { RecommendedPack } from '@/types'

export class RecommendedPackService {
  async getRecommendedPacks(): Promise<RecommendedPack[]> {
    try {
      const response = await fetch('/recommended-packs/index.json')
      if (!response.ok) {
        throw new Error('Failed to fetch recommended packs')
      }
      const packs: RecommendedPack[] = await response.json()
      return packs
    } catch (error) {
      console.error('获取推荐词包失败:', error)
      return []
    }
  }

  async downloadRecommendedPack(pack: RecommendedPack): Promise<File> {
    try {
      const response = await fetch(`/recommended-packs/${pack.fileName}`)
      if (!response.ok) {
        throw new Error(`Failed to download ${pack.fileName}`)
      }

      const blob = await response.blob()
      const file = new File([blob], pack.fileName, {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      })

      return file
    } catch (error) {
      console.error('下载推荐词包失败:', error)
      throw new Error(`下载失败: ${pack.name}`)
    }
  }
}

export const recommendedPackService = new RecommendedPackService()
