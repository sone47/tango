import { useLocalStorage } from '@uidotdev/usehooks'
import { isNil } from 'lodash'
import { useEffect, useState } from 'react'

import { wordPackService } from '@/services/wordPackService'
import type { WordPack } from '@/types'

interface UseCurrentWordPackResult {
  currentWordPackId: number | null
  currentWordPack: WordPack | null
  setCurrentWordPackId: (id: number | null) => void
}

const STORAGE_KEY = 'tango-current-wordpack-id'

export const useCurrentWordPack = (): UseCurrentWordPackResult => {
  const [currentWordPackId, setCurrentWordPackId] = useLocalStorage<number | null>(
    STORAGE_KEY,
    null
  )
  const [currentWordPack, setCurrentWordPack] = useState<WordPack | null>(null)

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
    if (isNil(currentWordPackId)) {
      setCurrentWordPack(null)
    } else {
      fetchCurrentWordPack(currentWordPackId)
    }
  }, [currentWordPackId])

  return {
    currentWordPackId,
    currentWordPack,
    setCurrentWordPackId,
  }
}
