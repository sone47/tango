import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'

import Button from '@/components/Button'
import Drawer, { useDrawer } from '@/components/Drawer'
import { useModalState } from '@/hooks/useModalState'
import ImportSection from '@/pages/wordpack/components/ImportSection'
import { ImportResult } from '@/services/wordPackService'
import { useWordPackStore } from '@/stores/wordPackStore'

import UploadResultModal from './UploadResultModal'

const Footer = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const wordPackStore = useWordPackStore()
  const uploadResultModal = useModalState()

  const importDrawer = useDrawer()
  const [uploadResult, setUploadResult] = useState<ImportResult | null>(null)

  useEffect(() => {
    if (location.state?.action === 'import' && !importDrawer.isOpen) {
      importDrawer.open()

      location.state = undefined
    }
  }, [importDrawer, location])

  const handleImportFromLibrary = () => {
    navigate('/recommended-packs')
  }

  const handleImportFinish = (importResult: ImportResult) => {
    setUploadResult(importResult)
    uploadResultModal.open()
    importDrawer.close()

    if (importResult.success) {
      wordPackStore.fetchWordPacks()
    }
  }

  const handleUploadResultModalClose = () => {
    uploadResultModal.close()
  }

  return (
    <div className="bg-muted/50 flex flex-col gap-2 p-4">
      <Button size="lg" className="w-full rounded-full" onClick={handleImportFromLibrary}>
        从词包库导入词包
      </Button>
      <Drawer
        open={importDrawer.isOpen}
        onOpenChange={importDrawer.setIsOpen}
        contentClassName="pb-0"
        title="导入自定义词包"
        cancelText="取消"
        showCancel={true}
        showCloseButton={false}
        trigger={
          <Button variant="outline" size="lg" className="w-full rounded-full">
            导入自定义词包
          </Button>
        }
      >
        <ImportSection onFinish={handleImportFinish} />
      </Drawer>

      <UploadResultModal
        isOpen={uploadResultModal.isOpen}
        onClose={handleUploadResultModalClose}
        wordPackId={uploadResult?.wordPackId}
        isSuccess={uploadResult?.success}
        message={uploadResult?.message}
        stats={uploadResult?.stats}
        errors={uploadResult?.errors}
      />
    </div>
  )
}

export default Footer
