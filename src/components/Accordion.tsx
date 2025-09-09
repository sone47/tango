import type { LucideIcon } from 'lucide-react'
import React from 'react'

import {
  Accordion as UIAccordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'

export interface AccordionItemData {
  id: string
  title: React.ReactNode
  content: React.ReactNode
  icon?: LucideIcon
  disabled?: boolean
}

export interface AccordionProps {
  items: AccordionItemData[]
  collapsible?: boolean
  defaultValue?: string | string[]
  value?: string | string[]
  className?: string
  itemClassName?: string
  triggerClassName?: string
  contentClassName?: string
}

interface AccordionSingleProps extends AccordionProps {
  type?: 'single'
  collapsible?: boolean
  defaultValue?: string
  value?: string
  onValueChange: (value: string) => void
}

interface AccordionMultipleProps extends AccordionProps {
  type?: 'multiple'
  defaultValue?: string[]
  value?: string[]
  onValueChange: (value: string[]) => void
}

const Accordion: React.FC<AccordionSingleProps | AccordionMultipleProps> = ({
  items,
  type = 'single',
  collapsible = true,
  defaultValue,
  value,
  onValueChange,
  className,
  itemClassName,
  triggerClassName,
  contentClassName,
}) => {
  const accordionProps = React.useMemo(() => {
    if (type === 'single') {
      return {
        type: 'single' as const,
        collapsible,
        defaultValue: defaultValue as string | undefined,
        value: value as string | undefined,
        onValueChange: onValueChange as ((value: string) => void) | undefined,
      }
    } else {
      return {
        type: 'multiple' as const,
        defaultValue: defaultValue as string[] | undefined,
        value: value as string[] | undefined,
        onValueChange: onValueChange as ((value: string[]) => void) | undefined,
      }
    }
  }, [type, collapsible, defaultValue, value, onValueChange])

  const renderItem = (item: AccordionItemData) => {
    const Icon = item.icon

    const triggerContent = (
      <div className="flex flex-1 items-center gap-3">
        {Icon && (
          <div className="flex h-5 w-5 shrink-0 items-center justify-center">
            <Icon size={18} className="text-muted-foreground" />
          </div>
        )}
        <span className="text-left">{item.title}</span>
      </div>
    )

    const itemElement = (
      <AccordionItem
        key={item.id}
        value={item.id}
        className={cn('border-b border-gray-200 last:border-b-0', itemClassName)}
        disabled={item.disabled}
      >
        <AccordionTrigger
          className={cn(
            'hover:no-underline py-4 px-0 font-medium text-foreground transition-colors',
            'hover:text-primary focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-primary focus-visible:ring-offset-2 rounded-md',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            triggerClassName
          )}
        >
          {triggerContent}
        </AccordionTrigger>
        <AccordionContent
          className={cn(
            'pb-4 pt-1 text-sm text-muted-foreground leading-relaxed',
            contentClassName
          )}
        >
          {item.content}
        </AccordionContent>
      </AccordionItem>
    )

    return itemElement
  }

  return (
    <UIAccordion {...accordionProps} className={cn('w-full divide-y divide-muted', className)}>
      {items.map((item) => renderItem(item))}
    </UIAccordion>
  )
}

export default Accordion
