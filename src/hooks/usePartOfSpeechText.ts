import { isNil } from 'lodash'

import { LanguageEnum, PartOfSpeechEnum, partOfSpeechToLanguageMap } from '@/constants/language'

export function usePartOfSpeechText(language: LanguageEnum) {
  const partOfSpeechMap =
    (partOfSpeechToLanguageMap[language] as Record<PartOfSpeechEnum, string>) ?? {}

  function getPartOfSpeechText(partOfSpeech: PartOfSpeechEnum) {
    return partOfSpeech === PartOfSpeechEnum.unknown || isNil(partOfSpeech)
      ? ''
      : partOfSpeechMap[partOfSpeech]
  }

  return {
    partOfSpeechMap,
    getPartOfSpeechText,
  }
}
