import { LanguageEnum } from '@/constants/language'

export interface WordPackEntity {
  id: number // 自增主键，可选
  name: string // 词包名
  language: LanguageEnum // 语言
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
}

export const wordPackSchema = {
  name: 'wordPacks',
  keyPath: 'id',
  autoIncrement: true,
  indexes: [
    { name: 'name', keyPath: 'name', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false },
  ],
  timestamps: {
    enabled: true, // 启用自动时间戳
    createdAt: 'createdAt', // 创建时间字段名
    updatedAt: 'updatedAt', // 更新时间字段名
  },
} as const
