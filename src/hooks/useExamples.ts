import { useEffect, useState } from 'react'

import { exampleService } from '@/services/exampleService'
import { type Example } from '@/types'

export function useExamples(
  vocabularyId?: number,
  options?: { onLoaded?: (examples: Example[]) => void }
) {
  const [examples, setExamples] = useState<Example[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const loadExamples = async () => {
      if (!vocabularyId) {
        setExamples([])
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        const fetchedExamples = await exampleService.getExamplesByVocabularyId(vocabularyId)
        setExamples(fetchedExamples)

        options?.onLoaded?.(fetchedExamples)
      } catch (error) {
        console.error('Failed to load examples:', error)
        setExamples([])
      } finally {
        setLoading(false)
      }
    }

    loadExamples()
  }, [vocabularyId])

  return { examples, loading, setExamples }
}
