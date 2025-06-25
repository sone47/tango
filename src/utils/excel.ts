import * as XLSX from 'xlsx'

import { timestamp } from './date'

// 通用的 Excel 行数据接口
export interface ExcelRowData {
  [key: string]: any
}

// Excel 解析选项
export interface ExcelParseOptions {
  sheetIndex?: number // 工作表索引，默认为 0
  headerRowIndex?: number // 标题行索引，默认为 0
  skipEmptyRows?: boolean // 是否跳过空行，默认为 true
}

// Excel 解析结果
export interface ExcelParseResult {
  data: ExcelRowData[]
  headers: string[]
  sheetName: string
  totalRows: number
}

/**
 * 解析 Excel 文件
 * @param file Excel 文件
 * @param options 解析选项
 * @returns 解析结果
 */
export const parseExcelFile = async (
  file: File,
  options: ExcelParseOptions = {}
): Promise<ExcelParseResult> => {
  const { sheetIndex = 0, headerRowIndex = 0, skipEmptyRows = true } = options

  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          throw new Error('文件读取失败')
        }

        // 解析 Excel 文件
        const workbook = XLSX.read(data, { type: 'binary' })

        if (workbook.SheetNames.length === 0) {
          throw new Error('Excel 文件中没有工作表')
        }

        if (sheetIndex >= workbook.SheetNames.length) {
          throw new Error(`工作表索引 ${sheetIndex} 超出范围`)
        }

        const sheetName = workbook.SheetNames[sheetIndex]
        const worksheet = workbook.Sheets[sheetName]

        // 转换为 JSON 数据
        const jsonData: ExcelRowData[] = XLSX.utils.sheet_to_json(worksheet, {
          header: headerRowIndex,
          defval: '', // 空单元格的默认值
          blankrows: !skipEmptyRows, // 是否包含空行
        })

        if (jsonData.length === 0) {
          throw new Error('Excel 文件没有有效数据')
        }

        // 获取表头
        const headers = headerRowIndex === 0 ? Object.keys(jsonData[0] || {}) : []

        const result: ExcelParseResult = {
          data: jsonData,
          headers,
          sheetName,
          totalRows: jsonData.length,
        }

        resolve(result)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsBinaryString(file)
  })
}

/**
 * 验证文件是否为有效的 Excel 文件
 * @param file 文件对象
 * @returns 是否为有效的 Excel 文件
 */
export const isValidExcelFile = (file: File): boolean => {
  const validTypes = [
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel', // .xls
  ]

  return validTypes.includes(file.type) || /\.(xlsx?|xls)$/i.test(file.name)
}

/**
 * 获取 Excel 文件的基本信息
 * @param file Excel 文件
 * @returns 文件信息
 */
export const getExcelFileInfo = async (
  file: File
): Promise<{
  sheetNames: string[]
  fileSize: number
  fileName: string
  fileType: string
}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (!data) {
          throw new Error('文件读取失败')
        }

        const workbook = XLSX.read(data, { type: 'binary' })

        resolve({
          sheetNames: workbook.SheetNames,
          fileSize: file.size,
          fileName: file.name,
          fileType: file.type,
        })
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('文件读取失败'))
    }

    reader.readAsBinaryString(file)
  })
}

// 导出功能相关接口和函数

// 导出数据的行接口
export interface ExportRowData {
  [key: string]: any
}

// Excel 导出选项
export interface ExcelExportOptions {
  fileName?: string // 文件名，默认为当前时间戳
  sheetName?: string // 工作表名称，默认为 'Sheet1'
  headers?: string[] // 自定义表头
  autoWidth?: boolean // 是否自动调整列宽，默认为 true
}

/**
 * 导出数据为 Excel 文件
 * @param data 要导出的数据
 * @param options 导出选项
 */
export const exportToExcel = (data: ExportRowData[], options: ExcelExportOptions = {}): void => {
  const {
    fileName = `export_${timestamp()}.xlsx`,
    sheetName = 'Sheet1',
    headers,
    autoWidth = true,
  } = options

  try {
    // 创建工作簿
    const workbook = XLSX.utils.book_new()

    // 准备数据
    let exportData = data
    if (headers) {
      // 如果指定了表头，重新组织数据
      exportData = data.map((row) => {
        const newRow: ExportRowData = {}
        headers.forEach((header) => {
          newRow[header] = row[header] || ''
        })
        return newRow
      })
    }

    // 创建工作表
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // 自动调整列宽
    if (autoWidth) {
      const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1')
      const columnWidths: number[] = []

      // 计算每列的最大宽度
      for (let col = range.s.c; col <= range.e.c; col++) {
        let maxWidth = 10 // 最小宽度

        for (let row = range.s.r; row <= range.e.r; row++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col })
          const cell = worksheet[cellAddress]
          if (cell && cell.v) {
            const cellValue = String(cell.v)
            maxWidth = Math.max(maxWidth, cellValue.length + 2)
          }
        }

        columnWidths.push(Math.min(maxWidth, 50)) // 最大宽度限制为 50
      }

      worksheet['!cols'] = columnWidths.map((width) => ({ width }))
    }

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    // 下载文件
    XLSX.writeFile(workbook, fileName)
  } catch (error) {
    console.error('导出 Excel 文件失败:', error)
    throw new Error(`导出失败：${error instanceof Error ? error.message : '未知错误'}`)
  }
}

/**
 * 将数据转换为 CSV 格式并下载
 * @param data 要导出的数据
 * @param fileName 文件名
 */
export const exportToCSV = (
  data: ExportRowData[],
  fileName = `export_${timestamp()}.csv`
): void => {
  try {
    if (data.length === 0) {
      throw new Error('没有数据可导出')
    }

    // 获取所有列名
    const headers = Object.keys(data[0])

    // 创建 CSV 内容
    const csvContent = [
      headers.join(','), // 表头
      ...data.map((row) =>
        headers
          .map((header) => {
            const value = row[header] || ''
            // 如果值包含逗号、引号或换行符，需要用引号包围
            return typeof value === 'string' &&
              (value.includes(',') || value.includes('"') || value.includes('\n'))
              ? `"${value.replace(/"/g, '""')}"` // 转义引号
              : value
          })
          .join(',')
      ),
    ].join('\n')

    // 创建 Blob 对象
    const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8' }) // \uFEFF 是 BOM，确保中文正确显示

    // 创建下载链接
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName

    // 触发下载
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // 清理 URL 对象
    URL.revokeObjectURL(url)
  } catch (error) {
    console.error('导出 CSV 文件失败:', error)
    throw new Error(`导出失败：${error instanceof Error ? error.message : '未知错误'}`)
  }
}
