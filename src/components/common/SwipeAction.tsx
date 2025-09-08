import 'react-swipeable-list/dist/styles.css'

import { isNil } from 'lodash'
import {
  LeadingActions,
  SwipeableList,
  SwipeableListItem,
  type SwipeableListProps,
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
interface SwipeActionProps<T = any> extends Omit<SwipeableListProps, 'children'> {
  closeOnAction?: boolean
  closeOnTouchOutside?: boolean
  leadingActions?: Action<T>[]
  trailingActions?: Action<T>[]
  list: {
    node: React.ReactNode
    item: T
    className?: string
  }[]
  className?: string
  itemClassName?: string
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
        'h-full flex items-center p-2 text-sm font-medium text-secondary-foreground',
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
  itemClassName,
  ...restProps
}: SwipeActionProps) => {
  return (
    <SwipeableList {...restProps} type={isNil(restProps.type) ? Type.IOS : restProps.type}>
      {list.map((item, index) => (
        <SwipeableListItem
          key={index}
          className={cn(itemClassName, item.className)}
          leadingActions={
            leadingActions?.length ? (
              <LeadingActions>
                {leadingActions?.map((action) => (
                  <SwipeableAction
                    key={action.key}
                    onClick={() => {
                      action.onClick?.(item.item)
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
                      action.onClick?.(item.item)
                    }}
                  >
                    <ActionContent className={action.className}>{action.text}</ActionContent>
                  </SwipeableAction>
                ))}
              </TrailingActions>
            ) : null
          }
        >
          {item.node}
        </SwipeableListItem>
      ))}
    </SwipeableList>
  )
}

export default SwipeAction
