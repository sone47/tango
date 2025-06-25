export interface VocabularyEntity {
  id: number // 自增主键，可选
  cardPackId: number // 卡包ID，外键
  phonetic?: string // 音标
  word: string // 写法
  definition: string // 释义
  example?: string // 例句
  wordAudio?: string // 词汇音频URL或Base64
  exampleAudio?: string // 例句音频URL或Base64
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
}

export const vocabularySchema = {
  name: 'vocabularies',
  keyPath: 'id',
  autoIncrement: true,
  indexes: [
    { name: 'cardPackId', keyPath: 'cardPackId', unique: false },
    { name: 'word', keyPath: 'word', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false },
  ],
  timestamps: {
    enabled: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
} as const
