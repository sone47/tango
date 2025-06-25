import { cardPackSchema } from './cardPackSchema'
import { practiceSchema } from './practiceSchema'
import { vocabularySchema } from './vocabularySchema'
import { wordPackSchema } from './wordPackSchema'

export type { CardPackEntity } from './cardPackSchema'
export { cardPackSchema } from './cardPackSchema'
export type { PracticeEntity } from './practiceSchema'
export { practiceSchema } from './practiceSchema'
export type { VocabularyEntity } from './vocabularySchema'
export { vocabularySchema } from './vocabularySchema'
export type { WordPackEntity } from './wordPackSchema'
export { wordPackSchema } from './wordPackSchema'

export const allSchemas = [
  wordPackSchema,
  cardPackSchema,
  vocabularySchema,
  practiceSchema,
] as const

export interface BaseEntity {
  id?: number
  createdAt?: string
  updatedAt?: string
}
