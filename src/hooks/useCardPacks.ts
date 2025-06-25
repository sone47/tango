import { isNil } from 'lodash'
import { useEffect, useState } from 'react'

import { cardPackService } from '@/services/cardPackService'
import type { CardPack } from '@/types'

import { useCurrentWordPack } from './useCurrentWordPack'

interface UseCardPacksResult {
  cardPacks: CardPack[]
  loading: boolean
  hasData: boolean
  error: string | null
}

export const useCardPacks = (): UseCardPacksResult => {
  const { currentWordPackId, hasData: hasWordPackData } = useCurrentWordPack()
  const [cardPacks, setCardPacks] = useState<CardPack[]>([])
  const [loading, setLoading] = useState(true)
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

  // 当当前词包ID变化时，重新获取卡包
  useEffect(() => {
    fetchCardPacks(currentWordPackId)
  }, [currentWordPackId])

  return {
    cardPacks,
    loading,
    hasData: hasWordPackData && cardPacks.length > 0,
    error,
  }
}
