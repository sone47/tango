import type { VocabularyEntity } from './vocabularySchema'

export interface CardPackEntity {
  id: number // 自增主键，可选
  wordPackId: number // 词包ID，外键
  name: string // 卡包名
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
  words: VocabularyEntity[]
}

export const cardPackSchema = {
  name: 'cardPacks',
  keyPath: 'id',
  autoIncrement: true,
  indexes: [
    { name: 'wordPackId', keyPath: 'wordPackId', unique: false },
    { name: 'name', keyPath: 'name', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false },
  ],
  timestamps: {
    enabled: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
} as const
