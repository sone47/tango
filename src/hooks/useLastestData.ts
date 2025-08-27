import { useLocalStorage } from '@uidotdev/usehooks'

import { LOCAL_STORAGE_KEYS } from '@/constants/localStorageKeys'
import { DateUtils } from '@/utils/date'

export interface LatestData {
  cardPackId: number
  practiceDate: string
  syncDate: string
}

export const useLastestData = () => {
  const [latestData, setLatestData] = useLocalStorage<Partial<LatestData>>(
    LOCAL_STORAGE_KEYS.LATEST_DATA,
    {}
  )

  const setLatestCardPackId = (cardPackId: number) => {
    setLatestData({
      ...latestData,
      cardPackId,
    })
  }

  const setLatestPracticeDate = (date: Date) => {
    setLatestData({
      ...latestData,
      practiceDate: DateUtils.format(date),
    })
  }

  const setLatestSyncDate = (date: Date) => {
    setLatestData({
      ...latestData,
      syncDate: DateUtils.format(date),
    })
  }

  return {
    ...latestData,
    setLatestData,
    setLatestCardPackId,
    setLatestPracticeDate,
    setLatestSyncDate,
  }
}
