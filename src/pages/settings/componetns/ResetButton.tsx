import { toast } from 'sonner'

import AlertDialog, { useAlertDialog } from '@/components/AlertDialog'
import Button from '@/components/Button'
import { useSettings } from '@/hooks/useSettings'

export default function ResetButton() {
  const { resetSettings } = useSettings()
  const resetDialog = useAlertDialog()

  const handleReset = () => {
    resetSettings()
    toast.success('设置已重置')
  }

  return (
    <>
      <Button variant="destructive" size="md" className="w-full" onClick={() => resetDialog.show()}>
        重置所有设置
      </Button>
      <AlertDialog
        open={resetDialog.isOpen}
        onOpenChange={resetDialog.setIsOpen}
        title="重置所有设置"
        description="重置所有设置会将所有设置恢复至默认值，您确定要重置吗？"
        confirmText="重置"
        onConfirm={handleReset}
      />
    </>
  )
}
