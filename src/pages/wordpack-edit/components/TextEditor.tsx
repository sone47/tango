import { Edit } from 'lucide-react'
import { useEffect, useState } from 'react'

import Drawer from '@/components/Drawer'
import Input from '@/components/Input'
import Typography from '@/components/Typography'
import { cn } from '@/lib/utils'

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
                  <Edit className="size-5 text-primary cursor-pointer absolute -right-2 top-1/2 translate-x-full -translate-y-1/2" />
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
