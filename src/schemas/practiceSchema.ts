export interface PracticeEntity {
  id: number // 自增主键，可选
  vocabularyId: number // 词汇ID，外键
  practiceCount: number // 练习次数，默认0
  proficiency: number // 熟练度，默认 0
  lastPracticeTime: string // 最近练习时间 YYYY-MM-DD HH:mm:ss
  createdAt?: string // 创建时间
  updatedAt?: string // 更新时间
}

export const practiceSchema = {
  name: 'practices',
  keyPath: 'id',
  autoIncrement: true,
  indexes: [
    { name: 'vocabularyId', keyPath: 'vocabularyId', unique: false },
    { name: 'proficiency', keyPath: 'proficiency', unique: false },
    { name: 'lastPracticeTime', keyPath: 'lastPracticeTime', unique: false },
    { name: 'createdAt', keyPath: 'createdAt', unique: false },
  ],
  timestamps: {
    enabled: true,
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
} as const
