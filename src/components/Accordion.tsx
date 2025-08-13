import { motion } from 'framer-motion'
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
  type?: 'single' | 'multiple'
  collapsible?: boolean
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  className?: string
  itemClassName?: string
  triggerClassName?: string
  contentClassName?: string
  animated?: boolean
  animationDelay?: number
}

const Accordion: React.FC<AccordionProps> = ({
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
  animated = true,
  animationDelay = 0.1,
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

  const renderItem = (item: AccordionItemData, index: number) => {
    const Icon = item.icon

    const triggerContent = (
      <div className="flex items-center gap-3 flex-1">
        {Icon && (
          <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
            <Icon size={18} className="text-gray-600" />
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
            'hover:no-underline py-4 px-0 text-sm font-medium text-gray-900 transition-colors',
            'hover:text-blue-600 focus-visible:outline-none focus-visible:ring-2',
            'focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            triggerClassName
          )}
        >
          {triggerContent}
        </AccordionTrigger>
        <AccordionContent
          className={cn('pb-4 pt-1 text-sm text-gray-600 leading-relaxed', contentClassName)}
        >
          {item.content}
        </AccordionContent>
      </AccordionItem>
    )

    if (animated) {
      return (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.3,
            delay: index * animationDelay,
            ease: 'easeOut',
          }}
        >
          {itemElement}
        </motion.div>
      )
    }

    return itemElement
  }

  return (
    <UIAccordion {...accordionProps} className={cn('w-full divide-y divide-gray-200', className)}>
      {items.map((item, index) => renderItem(item, index))}
    </UIAccordion>
  )
}

export default Accordion
