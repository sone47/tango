import { useCallback, useState } from 'react'

import { allSchemas } from '@/schemas'
import { IDBManager } from '@/utils/idbManager'

interface UseDatabaseReturn {
  init: () => Promise<void>
  isInitializing: boolean
  error: string | null
  retry: () => Promise<void>
  idbManager: IDBManager
}

const idbManager = new IDBManager()
let isInitialized = false
let initPromise: Promise<void> | null = null

export const getGlobalIDBManager = () => {
  return idbManager
}

/**
 * 数据库初始化 Hook
 *
 * 用于初始化 IndexedDB 数据库连接，提供加载状态管理和 IDBManager 实例
 *
 * @param dbName 数据库名称
 * @param dbVersion 数据库版本号
 * @returns 包含初始化函数、加载状态、错误状态和数据库管理器实例的对象
 */
export const useDatabase = (dbName: string, dbVersion: number): UseDatabaseReturn => {
  const [isInitializing, setIsInitializing] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const initDatabase = useCallback(async (): Promise<void> => {
    // 如果已经初始化过，直接返回
    if (isInitialized) {
      setIsInitializing(false)
      setError(null)
      return
    }

    // 如果正在初始化，返回当前的初始化 Promise
    if (initPromise) {
      return initPromise
    }

    // 开始初始化
    setIsInitializing(true)
    setError(null)

    initPromise = (async () => {
      try {
        await idbManager.initDB(dbName, dbVersion, allSchemas)
        isInitialized = true
        setError(null)
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : '数据库初始化失败'
        console.error('数据库初始化失败:', err)
        setError(errorMessage)
        throw err
      } finally {
        setIsInitializing(false)
        initPromise = null
      }
    })()

    return initPromise
  }, [dbName, dbVersion])

  const retry = useCallback(async (): Promise<void> => {
    isInitialized = false
    initPromise = null
    return initDatabase()
  }, [initDatabase])

  return {
    init: initDatabase,
    isInitializing,
    error,
    retry,
    idbManager,
  }
}
