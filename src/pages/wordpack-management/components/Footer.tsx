import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Button from '@/components/Button'
import Drawer, { useDrawer } from '@/components/Drawer'
import { useModalState } from '@/hooks/useModalState'
import ImportSection from '@/pages/wordpack-management/components/ImportSection'
import { ImportResult } from '@/services/wordPackService'
import { useWordPackStore } from '@/stores/wordPackStore'

import UploadResultModal from './UploadResultModal'

const Footer = () => {
  const navigate = useNavigate()
  const wordPackStore = useWordPackStore()
  const uploadResultModal = useModalState()

  const importDrawer = useDrawer()
  const [uploadResult, setUploadResult] = useState<ImportResult | null>(null)

  const handleImportFromLibrary = () => {
    navigate('/recommended-packs')
  }

  const handleImportSuccess = (importResult: ImportResult) => {
    wordPackStore.fetchWordPacks()
    setUploadResult(importResult)

    importDrawer.close()
    uploadResultModal.open()
  }

  const handleUploadResultModalClose = () => {
    uploadResultModal.close()
  }

  return (
    <div className="flex flex-col gap-2">
      <Button className="w-full" onClick={handleImportFromLibrary}>
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
          <Button variant="outline" className="w-full">
            导入自定义词包
          </Button>
        }
      >
        <ImportSection onSuccess={handleImportSuccess} />
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
