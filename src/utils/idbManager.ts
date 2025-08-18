import { IDBPDatabase, IDBPIndex, IDBPObjectStore, openDB } from 'idb'
import { isUndefined } from 'lodash'

import { toISOString } from './date'

export interface SchemaConfig {
  readonly name: string
  readonly keyPath: string
  readonly autoIncrement: boolean
  readonly indexes: ReadonlyArray<{
    readonly name: string
    readonly keyPath: string
    readonly unique: boolean
  }>
  readonly timestamps?: {
    readonly createdAt?: string // 字段名，默认 'createdAt'
    readonly updatedAt?: string // 字段名，默认 'updatedAt'
    readonly enabled?: boolean // 是否启用自动时间戳，默认 true
  }
}

// 查询条件类型
export interface QueryCondition {
  field: string
  operator: 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'range'
  value: any
  upperBound?: any // 用于range查询
  lowerOpen?: boolean // 范围查询：下界是否开放
  upperOpen?: boolean // 范围查询：上界是否开放
}

export interface QueryOptions {
  where?: QueryCondition[]
  orderBy?: {
    field: string
    direction: 'asc' | 'desc'
  }
  limit?: number
  offset?: number
}

// 增强的错误类型
export class IDBManagerError extends Error {
  constructor(
    message: string,
    public readonly code?: string
  ) {
    super(message)
    this.name = 'IDBManagerError'
  }
}

export class IDBManager {
  private db: IDBPDatabase | null = null

  /**
   * 初始化数据库连接
   * @param dbName 数据库名称
   * @param dbVersion 数据库版本
   * @param schemas 表结构配置数组
   */
  async initDB(dbName: string, dbVersion: number, schemas: readonly SchemaConfig[]): Promise<void> {
    this.db = await openDB(dbName, dbVersion, {
      upgrade(db) {
        // 为每个schema创建对象存储和索引
        schemas.forEach((schema) => {
          if (!db.objectStoreNames.contains(schema.name)) {
            const store = db.createObjectStore(schema.name, {
              keyPath: schema.keyPath,
              autoIncrement: schema.autoIncrement,
            })

            // 创建索引
            schema.indexes.forEach((index) => {
              store.createIndex(index.name, index.keyPath, {
                unique: index.unique,
              })
            })
          }
        })
      },
    })
  }

  /**
   * 获取数据库实例
   */
  getDB(): IDBPDatabase {
    if (!this.db) {
      throw new IDBManagerError('数据库未初始化，请先调用 initDB() 方法', 'DB_NOT_INITIALIZED')
    }
    return this.db
  }

  /**
   * 创建Repository实例
   */
  public getRepository<T extends Record<string, any>>(schema: SchemaConfig) {
    return new Repository<T>(this, schema)
  }

  /**
   * 执行事务
   * @param storeNames 涉及的表名
   * @param mode 事务模式
   * @param callback 事务执行回调
   * @returns 事务执行结果
   */
  async transaction<T>(
    storeNames: string | string[],
    mode: IDBTransactionMode,
    callback: (stores: { [key: string]: any }) => Promise<T>
  ): Promise<T> {
    const db = this.getDB()
    const tx = db.transaction(storeNames, mode)

    const stores: { [key: string]: any } = {}
    const names = Array.isArray(storeNames) ? storeNames : [storeNames]
    names.forEach((name) => {
      stores[name] = tx.objectStore(name)
    })

    try {
      const result = await callback(stores)
      await tx.done
      return result
    } catch (error) {
      console.error('事务执行失败:', error)
      try {
        await tx.done
      } catch (txError) {
        console.error('事务回滚失败:', txError)
      }

      throw error instanceof IDBManagerError
        ? error
        : new IDBManagerError(
            `事务执行失败: ${error instanceof Error ? error.message : String(error)}`,
            'TRANSACTION_FAILED'
          )
    }
  }

  /**
   * 在事务中执行多表批量操作
   * @param operations 操作配置数组
   * @returns 操作结果
   */
  async batchTransaction<T extends Record<string, any>>(
    operations: Array<{
      schema: SchemaConfig
      action: 'save' | 'update' | 'delete'
      data: any
    }>
  ): Promise<T[]> {
    if (operations.length === 0) {
      return []
    }

    // 获取所有涉及的表名
    const storeNames = [...new Set(operations.map((op) => op.schema.name))]

    return this.transaction(storeNames, 'readwrite', async (stores) => {
      const results: T[] = []

      try {
        for (const operation of operations) {
          const store = stores[operation.schema.name]
          const repo = new Repository<T>(this, operation.schema)

          let result: any

          switch (operation.action) {
            case 'save': {
              const dataWithTimestamps = repo.addTimestamps(operation.data, false)
              result = await store.add(dataWithTimestamps)
              results.push({ ...dataWithTimestamps, id: result } as unknown as T)
              break
            }

            case 'update': {
              const updateDataWithTimestamps = repo.addTimestamps(operation.data, true)
              result = await store.put(updateDataWithTimestamps)
              results.push({ ...updateDataWithTimestamps, id: result } as unknown as T)
              break
            }

            case 'delete': {
              await store.delete(operation.data.id)
              results.push(operation.data)
              break
            }

            default:
              throw new IDBManagerError(
                `不支持的操作类型: ${operation.action}`,
                'INVALID_OPERATION'
              )
          }
        }

        return results
      } catch (error) {
        // 抛出错误，让事务自动回滚
        throw error instanceof IDBManagerError
          ? error
          : new IDBManagerError(
              `批量操作失败: ${error instanceof Error ? error.message : String(error)}`,
              'BATCH_OPERATION_FAILED'
            )
      }
    })
  }
}

export class Repository<T extends Record<string, any>> {
  constructor(
    private manager: IDBManager,
    private schema: SchemaConfig
  ) {}

  private isPrimaryKey(field: string): boolean {
    return field === this.schema.keyPath
  }

  /**
   * 验证字段是否有索引
   */
  private hasIndex(field: string): boolean {
    if (this.isPrimaryKey(field)) return true
    return this.schema.indexes.some((index) => index.keyPath === field)
  }

  /**
   * 获取可用的索引字段列表
   */
  private getAvailableIndexes(): string[] {
    const indexes = [this.schema.keyPath] // 主键
    this.schema.indexes.forEach((index) => {
      indexes.push(index.keyPath)
    })
    return indexes
  }

  private validateIndexField(field: string): void {
    if (!this.hasIndex(field)) {
      throw new IDBManagerError(
        `字段 '${field}' 没有索引。可用索引字段: ${this.getAvailableIndexes().join(', ')}`,
        'FIELD_NOT_INDEXED'
      )
    }
  }

  /**
   * 验证查询条件是否都基于索引
   */
  private validateIndexedQuery(conditions: QueryCondition[]): void {
    for (const condition of conditions) {
      this.validateIndexField(condition.field)
    }
  }

  /**
   * 索引访问器
   */
  private getIndexOrStore(field: string): IDBPIndex | IDBPObjectStore {
    this.validateIndexField(field)

    const db = this.manager.getDB()
    const tx = db.transaction(this.schema.name, 'readonly')
    const store = tx.objectStore(this.schema.name)

    if (this.isPrimaryKey(field)) {
      return store
    } else {
      return store.index(field)
    }
  }

  /**
   * 添加时间戳
   */
  addTimestamps(data: Partial<T>, isUpdate = false): Partial<T> {
    // 检查是否启用时间戳
    const timestampConfig = this.schema.timestamps
    if (!timestampConfig?.enabled) {
      return data
    }

    const now = toISOString()
    const result = { ...data }

    // 获取字段名配置，使用默认值
    const createdAtField = timestampConfig?.createdAt ?? 'createdAt'
    const updatedAtField = timestampConfig?.updatedAt ?? 'updatedAt'

    if (!isUpdate) {
      ;(result as any)[createdAtField] = now
    }
    ;(result as any)[updatedAtField] = now

    return result
  }

  /**
   * 保存数据（创建或更新）
   */
  async save(data: Omit<T, 'id'>): Promise<T> {
    const db = this.manager.getDB()
    const isUpdate = 'id' in data && data.id !== undefined
    const entityWithTimestamps = this.addTimestamps(data as T, isUpdate)

    const result = await db.put(this.schema.name, entityWithTimestamps)
    return { ...entityWithTimestamps, id: result } as unknown as T
  }

  /**
   * 批量保存
   */
  async saveMany(dataList: T[]): Promise<T[]> {
    if (dataList.length === 0) {
      return []
    }

    const db = this.manager.getDB()
    const tx = db.transaction(this.schema.name, 'readwrite')
    const store = tx.objectStore(this.schema.name)

    const results: T[] = []

    try {
      for (const data of dataList) {
        const entityWithTimestamps = this.addTimestamps(data)
        const result = await store.put(entityWithTimestamps)
        results.push({ ...entityWithTimestamps, id: result } as unknown as T)
      }

      await tx.done
      return results
    } catch (error) {
      throw new IDBManagerError(
        `批量保存失败: ${error instanceof Error ? error.message : String(error)}`,
        'SAVE_MANY_FAILED'
      )
    }
  }

  /**
   * 根据ID查找（基于主键）
   */
  async findById(id: number): Promise<T | undefined> {
    const db = this.manager.getDB()
    return db.get(this.schema.name, id)
  }

  /**
   * 基于索引的高级查询
   */
  async findAll(options?: QueryOptions): Promise<T[]> {
    // 无条件查询
    if (!options || (!options.where && !options.orderBy)) {
      const db = this.manager.getDB()
      return db.getAll(this.schema.name)
    }

    // 验证所有查询条件都基于索引
    if (options.where?.length) {
      this.validateIndexedQuery(options.where)
    }

    // 验证排序字段是否有索引
    if (options.orderBy) {
      this.validateIndexField(options.orderBy.field)
    }

    // 单个等值条件，直接使用索引
    if (options.where?.length === 1) {
      const condition = options.where[0]
      if (condition.operator === 'eq') {
        const results = await this.findBy(condition.field, condition.value)

        // 排序
        if (options.orderBy) {
          results.sort((a, b) => {
            const aVal = a[options.orderBy!.field]
            const bVal = b[options.orderBy!.field]
            const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
            return options.orderBy!.direction === 'desc' ? -comparison : comparison
          })
        }

        // 分页
        const start = options.offset || 0
        const end = options.limit ? start + options.limit : undefined
        return results.slice(start, end)
      }
    }

    // 无条件但有排序，使用游标优化
    if (options.orderBy && !options.where?.length) {
      return this.findAllWithCursor({
        orderBy: options.orderBy,
        limit: options.limit,
        offset: options.offset,
      })
    }

    // 复杂条件查询
    if (options.where?.length) {
      return this.executeOptimizedComplexQuery(options)
    }

    return []
  }

  /**
   * 使用游标的排序查询
   */
  private async findAllWithCursor(options: {
    orderBy: { field: string; direction: 'asc' | 'desc' }
    limit?: number
    offset?: number
  }): Promise<T[]> {
    const indexOrStore = this.getIndexOrStore(options.orderBy.field)
    const direction = options.orderBy.direction === 'desc' ? 'prev' : 'next'

    try {
      let cursor = await indexOrStore.openCursor(null, direction)
      const results: T[] = []
      let skipCount = options.offset || 0
      const takeCount = options.limit || Infinity

      while (cursor && results.length < takeCount) {
        if (skipCount > 0) {
          skipCount--
        } else {
          results.push(cursor.value as T)
        }
        cursor = await cursor.continue()
      }

      return results
    } catch (error) {
      throw new IDBManagerError(
        `游标查询失败: ${error instanceof Error ? error.message : String(error)}`,
        'CURSOR_QUERY_FAILED'
      )
    }
  }

  /**
   * 优化的复杂查询执行
   */
  private async executeOptimizedComplexQuery(options: QueryOptions): Promise<T[]> {
    if (!options.where || options.where.length === 0) {
      return []
    }

    try {
      // 选择最优的索引条件（优先等值查询，然后是范围查询）
      const eqConditions = options.where.filter((c) => c.operator === 'eq')
      const rangeConditions = options.where.filter((c) => c.operator !== 'eq')

      let baseResults: T[] = []

      if (eqConditions.length > 0) {
        // 使用第一个等值条件作为基础查询
        const baseCondition = eqConditions[0]
        baseResults = await this.findBy(baseCondition.field, baseCondition.value)

        // 在内存中过滤其他条件
        baseResults = baseResults.filter((item) =>
          options.where!.every((condition) => this.matchesCondition(item, condition))
        )
      } else if (rangeConditions.length > 0) {
        // 使用游标进行范围查询，避免加载过多数据到内存
        baseResults = await this.executeRangeQueryWithCursor(rangeConditions[0], options.where)
      }

      // 应用排序
      if (options.orderBy) {
        baseResults.sort((a, b) => {
          const aVal = a[options.orderBy!.field]
          const bVal = b[options.orderBy!.field]
          const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
          return options.orderBy!.direction === 'desc' ? -comparison : comparison
        })
      }

      // 应用分页
      const start = options.offset || 0
      const end = options.limit ? start + options.limit : undefined
      return baseResults.slice(start, end)
    } catch (error) {
      throw new IDBManagerError(
        `复杂查询执行失败: ${error instanceof Error ? error.message : String(error)}`,
        'COMPLEX_QUERY_FAILED'
      )
    }
  }

  /**
   * 使用游标执行范围查询
   */
  private async executeRangeQueryWithCursor(
    primaryCondition: QueryCondition,
    allConditions: QueryCondition[]
  ): Promise<T[]> {
    const indexOrStore = this.getIndexOrStore(primaryCondition.field)
    const range = this.createIDBKeyRange(primaryCondition)

    try {
      let cursor = await indexOrStore.openCursor(range)
      const results: T[] = []

      while (cursor) {
        const item = cursor.value as T
        if (allConditions.every((condition) => this.matchesCondition(item, condition))) {
          results.push(item)
        }
        cursor = await cursor.continue()
      }

      return results
    } catch (error) {
      throw new IDBManagerError(
        `范围查询失败: ${error instanceof Error ? error.message : String(error)}`,
        'RANGE_QUERY_FAILED'
      )
    }
  }

  /**
   * 创建IDBKeyRange
   */
  private createIDBKeyRange(condition: QueryCondition): IDBKeyRange | undefined {
    switch (condition.operator) {
      case 'gt':
        return IDBKeyRange.lowerBound(condition.value, true)
      case 'gte':
        return IDBKeyRange.lowerBound(condition.value, false)
      case 'lt':
        return IDBKeyRange.upperBound(condition.value, true)
      case 'lte':
        return IDBKeyRange.upperBound(condition.value, false)
      case 'range':
        return IDBKeyRange.bound(
          condition.value,
          condition.upperBound ?? condition.value,
          condition.lowerOpen ?? false,
          condition.upperOpen ?? false
        )
      case 'eq':
        return IDBKeyRange.only(condition.value)
      default:
        return undefined
    }
  }

  /**
   * 检查单个条件是否匹配
   */
  private matchesCondition(item: T, condition: QueryCondition): boolean {
    const fieldValue = item[condition.field]

    switch (condition.operator) {
      case 'eq':
        return fieldValue === condition.value
      case 'gt':
        return fieldValue > condition.value
      case 'gte':
        return fieldValue >= condition.value
      case 'lt':
        return fieldValue < condition.value
      case 'lte':
        return fieldValue <= condition.value
      case 'range':
        return (
          fieldValue >= condition.value && fieldValue <= (condition.upperBound ?? condition.value)
        )
      default:
        return false
    }
  }

  /**
   * 根据索引字段查找
   */
  async findBy<U extends keyof T>(field: U, value: T[U]): Promise<T[]> {
    const indexOrStore = this.getIndexOrStore(field as string)
    return indexOrStore.getAll(value)
  }

  /**
   * 根据索引字段查找单个记录 - 使用优化的索引访问
   */
  async findOneBy<U extends keyof T>(field: U, value: T[U]): Promise<T | undefined> {
    const indexOrStore = this.getIndexOrStore(field as string)
    return indexOrStore.get(value)
  }

  /**
   * 检查指定索引字段的记录是否存在 - 使用优化的索引访问
   */
  async existsBy<U extends keyof T>(field: U, value: T[U]): Promise<boolean> {
    const indexOrStore = this.getIndexOrStore(field as string)
    const key = await indexOrStore.getKey(value)
    return key !== undefined
  }

  /**
   * 根据索引范围查询 - 使用优化的索引访问
   */
  async findByRange<U extends keyof T>(
    field: U,
    lowerBound: T[U],
    upperBound: T[U],
    options?: {
      lowerOpen?: boolean
      upperOpen?: boolean
      limit?: number
      direction?: 'asc' | 'desc'
    }
  ): Promise<T[]> {
    const indexOrStore = this.getIndexOrStore(field as string)

    try {
      const range = IDBKeyRange.bound(
        lowerBound,
        upperBound,
        options?.lowerOpen ?? false,
        options?.upperOpen ?? false
      )

      const direction = options?.direction === 'desc' ? 'prev' : 'next'
      let cursor = await indexOrStore.openCursor(range, direction)
      const results: T[] = []
      const limit = options?.limit ?? Infinity

      while (cursor && results.length < limit) {
        results.push(cursor.value as T)
        cursor = await cursor.continue()
      }

      return results
    } catch (error) {
      throw new IDBManagerError(
        `范围查询失败: ${error instanceof Error ? error.message : String(error)}`,
        'RANGE_QUERY_FAILED'
      )
    }
  }

  /**
   * 更新记录（基于主键）
   */
  async update(
    id: number,
    data: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<T | undefined> {
    const existing = await this.findById(id)
    if (!existing) return undefined

    const updated = { ...existing, ...data }
    return this.save(updated)
  }

  /**
   * 删除记录（基于主键）
   */
  async delete(id: number): Promise<boolean> {
    const db = this.manager.getDB()
    try {
      await db.delete(this.schema.name, id)
      return true
    } catch {
      return false
    }
  }

  /**
   * 批量删除（基于主键）
   */
  async deleteMany(ids: number[]): Promise<number> {
    if (ids.length === 0) {
      return 0
    }

    const db = this.manager.getDB()
    const tx = db.transaction(this.schema.name, 'readwrite')
    const store = tx.objectStore(this.schema.name)

    let deletedCount = 0

    try {
      for (const id of ids) {
        try {
          await store.delete(id)
          deletedCount++
        } catch {
          // 忽略删除失败的情况（记录可能不存在）
        }
      }

      await tx.done
      return deletedCount
    } catch (error) {
      throw new IDBManagerError(
        `批量删除失败: ${error instanceof Error ? error.message : String(error)}`,
        'DELETE_MANY_FAILED'
      )
    }
  }

  /**
   * 基于索引的计数
   */
  async count<U extends keyof T>(field?: U, value?: T[U]): Promise<number> {
    const db = this.manager.getDB()

    if (!field && isUndefined(value)) {
      return db.count(this.schema.name)
    }

    if (!field) {
      throw new IDBManagerError('如果提供了 value，必须同时提供 field', 'INVALID_PARAMS')
    }

    const indexOrStore = this.getIndexOrStore(field as string)
    return indexOrStore.count(value)
  }

  /**
   * 清空表
   */
  async clear(): Promise<void> {
    const db = this.manager.getDB()
    await db.clear(this.schema.name)
  }
}
