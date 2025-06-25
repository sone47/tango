import dayjs from 'dayjs'

/**
 * 日期工具类
 * 统一管理应用中的日期格式和操作
 */
export class DateUtils {
  /**
   * 标准日期时间格式
   */
  static readonly FORMAT = 'YYYY-MM-DD HH:mm:ss'

  /**
   * 获取当前时间的标准格式字符串
   */
  static now(): string {
    return dayjs().format(DateUtils.FORMAT)
  }

  /**
   * 获取当前时间戳
   */
  static timestamp(): number {
    return dayjs().valueOf()
  }

  /**
   * 获取今天开始时间 (00:00:00)
   */
  static todayStart(): string {
    return dayjs().startOf('day').format(DateUtils.FORMAT)
  }

  /**
   * 获取今天结束时间 (23:59:59)
   */
  static todayEnd(): string {
    return dayjs().endOf('day').format(DateUtils.FORMAT)
  }

  /**
   * 获取今天的日期范围
   * @returns [开始时间, 结束时间]
   */
  static todayRange(): [string, string] {
    return [DateUtils.todayStart(), DateUtils.todayEnd()]
  }

  /**
   * 格式化日期为标准格式
   * @param date 日期对象、字符串或时间戳
   */
  static format(date: Date | string | number, format: string = DateUtils.FORMAT): string {
    return dayjs(date).format(format)
  }

  /**
   * 格式化为本地日期字符串
   * @param date 日期对象、字符串或时间戳
   */
  static toLocaleDateString(date: Date | string | number): string {
    return dayjs(date).format('YYYY/MM/DD')
  }

  /**
   * 格式化为本地时间字符串
   * @param date 日期对象、字符串或时间戳
   */
  static toLocaleTimeString(date: Date | string | number): string {
    return dayjs(date).format('HH:mm:ss')
  }

  /**
   * 获取 ISO 字符串
   * @param date 日期对象、字符串或时间戳
   */
  static toISOString(date?: Date | string | number): string {
    return dayjs(date).toISOString()
  }

  /**
   * 判断日期是否在今天
   * @param date 日期字符串
   */
  static isToday(date: string): boolean {
    return dayjs(date).isSame(dayjs(), 'day')
  }

  /**
   * 判断日期是否在指定范围内
   * @param date 要检查的日期
   * @param start 开始日期
   * @param end 结束日期
   */
  static isInRange(date: string, start: string, end: string): boolean {
    const targetDate = dayjs(date)
    return targetDate.isAfter(dayjs(start)) && targetDate.isBefore(dayjs(end))
  }

  /**
   * 获取指定日期的开始时间
   * @param date 日期对象、字符串或时间戳
   */
  static startOfDay(date: Date | string | number): string {
    return dayjs(date).startOf('day').format(DateUtils.FORMAT)
  }

  /**
   * 获取指定日期的结束时间
   * @param date 日期对象、字符串或时间戳
   */
  static endOfDay(date: Date | string | number): string {
    return dayjs(date).endOf('day').format(DateUtils.FORMAT)
  }

  /**
   * 获取指定日期的范围
   * @param date 日期对象、字符串或时间戳
   * @returns [开始时间, 结束时间]
   */
  static dayRange(date: Date | string | number): [string, string] {
    return [DateUtils.startOfDay(date), DateUtils.endOfDay(date)]
  }
}

/**
 * 便捷导出的函数
 */
export const {
  now,
  timestamp,
  todayStart,
  todayEnd,
  todayRange,
  format,
  toLocaleDateString,
  toLocaleTimeString,
  toISOString,
  isToday,
  isInRange,
  startOfDay,
  endOfDay,
  dayRange,
} = DateUtils
