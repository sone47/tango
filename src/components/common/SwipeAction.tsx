import 'react-swipeable-list/dist/styles.css'

import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  SwipeAction as SwipeableAction,
  TrailingActions,
  Type,
} from 'react-swipeable-list'

import { cn } from '@/lib/utils'

interface Action<T> {
  key: string
  text: string
  className?: string
  onClick?: (item: T) => void
}
interface SwipeActionProps<T = any> {
  closeOnAction?: boolean
  closeOnTouchOutside?: boolean
  leadingActions?: Action<T>[]
  trailingActions?: Action<T>[]
  list: {
    node: React.ReactNode
    item: T
  }[]
  className?: string
  itemClassName?: string
  fullSwipe?: boolean
}

const ActionContent = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <div
      className={cn(
        'h-full flex items-center p-2 text-sm font-medium text-secondary-foreground select-none',
        className
      )}
    >
      {children}
    </div>
  )
}

const SwipeAction = ({
  leadingActions,
  trailingActions,
  list,
  className,
  itemClassName,
  fullSwipe,
}: SwipeActionProps) => {
  return (
    <SwipeableList type={Type.IOS} className={className} fullSwipe={fullSwipe}>
      {list.map(({ node, item }, index) => (
        <SwipeableListItem
          key={index}
          className={itemClassName}
          leadingActions={
            leadingActions?.length ? (
              <LeadingActions>
                {leadingActions?.map((action) => (
                  <SwipeableAction
                    key={action.key}
                    onClick={() => {
                      action.onClick?.(item)
                    }}
                  >
                    <ActionContent className={action.className}>{action.text}</ActionContent>
                  </SwipeableAction>
                ))}
              </LeadingActions>
            ) : null
          }
          trailingActions={
            trailingActions?.length ? (
              <TrailingActions>
                {trailingActions?.map((action) => (
                  <SwipeableAction
                    key={action.key}
                    onClick={() => {
                      action.onClick?.(item)
                    }}
                  >
                    <ActionContent className={action.className}>{action.text}</ActionContent>
                  </SwipeableAction>
                ))}
              </TrailingActions>
            ) : null
          }
        >
          {node}
        </SwipeableListItem>
      ))}
    </SwipeableList>
  )
}

export default SwipeAction
