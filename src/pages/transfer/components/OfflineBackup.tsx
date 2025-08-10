import { Download, Upload } from 'lucide-react'

import Button from '@/components/Button'
import Card from '@/components/Card'
import toast from '@/components/Toast'
import { type DataSyncPayload, dataSyncService } from '@/services/dataSyncService'

export default function OfflineBackup() {
  const handleExportJSON = async () => {
    try {
      const payload = await dataSyncService.exportAll()
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tango-backup-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('导出完成')
    } catch (error) {
      toast.error('导出失败')
      console.error(error)
    }
  }

  const handleImportJSON = async (file: File) => {
    try {
      const text = await file.text()
      const payload = JSON.parse(text) as DataSyncPayload
      await dataSyncService.importAllOverwrite(payload)
      toast.success('导入完成')
    } catch (error) {
      toast.error('导入失败')
      console.error(error)
    }
  }

  return (
    <Card>
      <div className="space-y-3">
        <div className="font-medium">离线兜底</div>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="primary" icon={Download} onClick={handleExportJSON}>
            导出 JSON
          </Button>
          <label className="w-full">
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleImportJSON(e.target.files[0])}
            />
            <div className="w-full">
              <Button variant="secondary" icon={Upload} className="w-full">
                导入 JSON
              </Button>
            </div>
          </label>
        </div>
      </div>
    </Card>
  )
}
