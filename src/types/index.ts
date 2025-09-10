import { CardPackEntity, VocabularyEntity, WordPackEntity } from '@/schemas'

export type { CardRevealState } from './card'
export type { RecommendedPack } from './recommendedPack'
export type { TabType } from './ui'
export type {
  PracticeEntity as Practice,
  VocabularyEntity as Word,
} from '@/schemas'

export interface CardPack extends Omit<CardPackEntity, 'words'> {
  words: VocabularyEntity[]
}

export interface WordPack extends WordPackEntity {
  cardPacks: CardPack[]
}
