import { Edit } from 'lucide-react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import Drawer from '@/components/Drawer'
import Input from '@/components/Input'
import Typography from '@/components/Typography'

interface TextEditorProps {
  value: string
  isEdit: boolean
  editable?: boolean
  drawerTitle?: string
  titleWidth?: number
  onConfirm: (text: string) => void
  onEditStateChange: (isEdit: boolean) => void
}

const TextEditor = ({
  value: originalText,
  isEdit,
  editable,
  drawerTitle,
  titleWidth,
  onConfirm,
  onEditStateChange,
}: TextEditorProps) => {
  const [text, setText] = useState('')

  useEffect(() => {
    if (originalText) {
      setText(originalText)
    }
  }, [originalText])

  const handleEditConfirm = async () => {
    if (!text) {
      toast.error('名称不能为空')
      return
    }

    onConfirm(text)
  }

  const handleExitEdit = () => {
    setText(originalText)
  }

  const handleEditStateChange = (isEdit: boolean) => {
    onEditStateChange(isEdit)
  }

  return (
    <>
      <div
        className="flex items-center"
        onClick={(e) => {
          e.stopPropagation()

          if ((e.target as HTMLElement)?.getAttribute('data-slot') === 'drawer-overlay') {
            onEditStateChange(false)
          }
        }}
      >
        <div className="relative">
          <Typography.Title level={5} className="truncate" style={{ maxWidth: titleWidth }}>
            {originalText}
          </Typography.Title>
          {editable && (
            <div>
              <Drawer
                trigger={
                  <Edit className="text-primary absolute top-1/2 -right-2 size-5 translate-x-full -translate-y-1/2 cursor-pointer" />
                }
                open={isEdit}
                onOpenChange={handleEditStateChange}
                title={drawerTitle}
                showConfirm
                showCancel
                onConfirm={handleEditConfirm}
                onCancel={handleExitEdit}
              >
                <Input
                  autoFocus
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleEditConfirm()
                    }
                  }}
                />
              </Drawer>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default TextEditor
