import { cardPackSchema } from './cardPackSchema'
import { exampleSchema } from './exampleSchema'
import { practiceSchema } from './practiceSchema'
import { vocabularySchema } from './vocabularySchema'
import { wordPackSchema } from './wordPackSchema'

export type { CardPackEntity } from './cardPackSchema'
export { cardPackSchema } from './cardPackSchema'
export type { ExampleEntity } from './exampleSchema'
export { exampleSchema } from './exampleSchema'
export type { PracticeEntity } from './practiceSchema'
export { practiceSchema } from './practiceSchema'
export type { VocabularyEntity } from './vocabularySchema'
export { vocabularySchema } from './vocabularySchema'
export type { WordPackEntity } from './wordPackSchema'
export { wordPackSchema } from './wordPackSchema'

export const allSchemas = [
  cardPackSchema,
  exampleSchema,
  practiceSchema,
  vocabularySchema,
  wordPackSchema,
] as const

export interface BaseEntity {
  id?: number
  createdAt?: string
  updatedAt?: string
}
