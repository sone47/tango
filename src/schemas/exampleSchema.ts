export interface ExampleEntity {
  id: number // 自增主键，可选
  vocabularyId: number // 词汇ID，外键
  content: string // 例句
  translation: string // 翻译
  audio?: string // 例句音频URL或Base64
  isAi: boolean // 是否是AI生成
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
}

export const exampleSchema = {
  name: 'examples',
  keyPath: 'id',
  autoIncrement: true,
  indexes: [
    { name: 'vocabularyId', keyPath: 'vocabularyId', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false },
  ],
  timestamps: {
    enabled: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
} as const
