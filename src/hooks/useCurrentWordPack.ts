import { useLocalStorage } from '@uidotdev/usehooks'
import { isNil } from 'lodash'
import { useEffect, useState } from 'react'

import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKeys'
import { wordPackService } from '@/services/wordPackService'
import type { WordPackEntity } from '@/types'

interface UseCurrentWordPackResult {
  currentWordPackId: number | null
  currentWordPack: WordPackEntity | null
  setCurrentWordPackId: (id: number | null) => void
}

export const useCurrentWordPack = (): UseCurrentWordPackResult => {
  const [currentWordPackId, setCurrentWordPackId] = useLocalStorage<number | null>(
    LOCAL_STORAGE_KEYS.CURRENT_WORD_PACK_ID,
    null
  )
  const [currentWordPack, setCurrentWordPack] = useState<WordPackEntity | null>(null)

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
