import { LanguageEnum } from '@/constants/language'

export interface RecommendedPack {
  name: string
  description: string
  fileName: string
  category: string
  author: string
  version: string
  language: LanguageEnum
}
