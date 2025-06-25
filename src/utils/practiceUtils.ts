import { shuffle } from 'lodash'

import type { Practice, Word } from '@/types'

/**
 * 根据练习数据筛选单词
 */
export const filterWordsByProficiency = (
  words: Word[],
  practices: Practice[],
  maxProficiency: number
): Word[] => {
  if (maxProficiency === 0) return []

  const practiceMap = createPracticeMap(practices)

  return words.filter((word) => {
    const practice = practiceMap.get(word.id)
    const currentProficiency = practice?.proficiency || 0
    return currentProficiency <= maxProficiency
  })
}

/**
 * 应用词汇筛选和打乱逻辑
 */
export const processWords = (
  words: Word[],
  practices: Practice[],
  maxProficiency: number,
  shouldShuffle: boolean
): Word[] => {
  const filteredWords = filterWordsByProficiency(words, practices, maxProficiency)
  return shouldShuffle ? shuffle(filteredWords) : filteredWords
}

export const createPracticeMap = (practices: Practice[]): Map<number, Practice> => {
  return new Map(practices.map((practice) => [practice.vocabularyId, practice]))
}
