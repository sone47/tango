import { useLocalStorage } from '@uidotdev/usehooks'
import { isNil } from 'lodash'
import { useEffect, useState } from 'react'

import { wordPackService } from '@/services/wordPackService'
import { useWordPackStore } from '@/stores/wordPackStore'
import type { WordPack } from '@/types'

interface UseCurrentWordPackResult {
  currentWordPackId: number | null
  currentWordPack: WordPack | null
  allWordPacks: WordPack[]
  loading: boolean
  hasData: boolean
  error: string | null
  setCurrentWordPackId: (id: number | null) => void
}

const STORAGE_KEY = 'tango-current-wordpack-id'

export const useCurrentWordPack = (): UseCurrentWordPackResult => {
  const [currentWordPackId, setCurrentWordPackId] = useLocalStorage<number | null>(
    STORAGE_KEY,
    null
  )
  const [currentWordPack, setCurrentWordPack] = useState<WordPack | null>(null)

  const { allWordPacks, loading, hasData, error, fetchWordPacks } = useWordPackStore()

  const fetchCurrentWordPack = async (wordPackId: number) => {
    try {
      const wordPack = await wordPackService.getWordPackById(wordPackId)
      setCurrentWordPack(wordPack)
    } catch (err) {
      console.error('获取当前词包失败:', err)
      setCurrentWordPack(null)
    }
  }

  useEffect(() => {
    fetchWordPacks()
  }, [fetchWordPacks])

  useEffect(() => {
    if (!isNil(currentWordPackId)) {
      fetchCurrentWordPack(currentWordPackId)
    } else {
      setCurrentWordPack(null)
    }
  }, [currentWordPackId])

  useEffect(() => {
    if (!isNil(currentWordPackId) && allWordPacks.length) {
      const isValid = allWordPacks.some((wp) => wp.id === currentWordPackId)
      if (!isValid) {
        setCurrentWordPackId(allWordPacks[0]?.id || null)
      }
    }
  }, [allWordPacks, currentWordPackId, setCurrentWordPackId])

  return {
    currentWordPackId,
    currentWordPack,
    allWordPacks,
    loading,
    hasData,
    error,
    setCurrentWordPackId,
  }
}
