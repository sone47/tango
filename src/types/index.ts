import { CardPackEntity, VocabularyEntity } from '@/schemas'

export type { CardRevealState } from './card'
export type { RecommendedPack } from './recommendedPack'
export type { TabType } from './ui'
export type {
  PracticeEntity as Practice,
  VocabularyEntity as Word,
  WordPackEntity as WordPack,
} from '@/schemas'

export interface CardPack extends Omit<CardPackEntity, 'words'> {
  words: VocabularyEntity[]
}
