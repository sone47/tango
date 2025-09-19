import { PartOfSpeechEnum } from '@/constants/language'

export interface VocabularyEntity {
  id: number // 自增主键，可选
  cardPackId: number // 卡包ID，外键
  order: number // 卡片在卡包中的顺序
  phonetic?: string // 音标
  word: string // 写法
  definition: string // 释义
  partOfSpeech: PartOfSpeechEnum // 词性
  wordAudio?: string // 词汇音频URL或Base64
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
