import { isNil } from 'lodash'
import { useState } from 'react'

import { cardPackService } from '@/services/cardPackService'
import type { CardPack } from '@/types'

interface UseCardPacksResult {
  cardPacks: (CardPack & { progress: number })[]
  loading: boolean
  error: string | null
  fetchCardPacks: (wordPackId: number | null) => Promise<void>
}

export const useCardPacks = (): UseCardPacksResult => {
  const [cardPacks, setCardPacks] = useState<(CardPack & { progress: number })[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCardPacks = async (wordPackId: number | null) => {
    if (isNil(wordPackId)) {
      setCardPacks([])
      return
    }

    try {
      setLoading(true)
      setError(null)

      const cardPackList = await cardPackService.getCardPacksByWordPackId(wordPackId)
      setCardPacks(cardPackList)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '获取卡包失败'
      console.error('获取卡包失败:', err)
      setError(errorMessage)
      setCardPacks([])
    } finally {
      setLoading(false)
    }
  }

  return {
    fetchCardPacks,
    cardPacks,
    loading,
    error,
  }
}
