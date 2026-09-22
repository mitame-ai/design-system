import type { ComponentProps } from 'react'
import * as ResizablePrimitive from 'react-resizable-panels'
import { Glyph } from '../lib/marks'
import { cn } from '../lib/utils'
import { Rule } from './Rule'

/** 仕切り — 区画のあいだの罫を、手でずらして広さを変える */
export function ResizablePanelGroup({ className, ...props }: ResizablePrimitive.GroupProps) {
  return <ResizablePrimitive.Group className={cn('tz-resize', className)} {...props} />
}

export function ResizablePanel(props: ResizablePrimitive.PanelProps) {
  return <ResizablePrimitive.Panel {...props} />
}

export interface ResizableHandleProps extends ComponentProps<typeof ResizablePrimitive.Separator> {
  /** 仕切りの中央につまみを描く */
  withHandle?: boolean
}

/**
 * 仕切りの罫。罫の向きは要素の縦横比から自動で決まる（細長ければ縦に引く）。
 */
export function ResizableHandle({ withHandle = false, className, ...props }: ResizableHandleProps) {
  return (
    <ResizablePrimitive.Separator className={cn('tz-resize__handle', className)} {...props}>
      <Rule className="tz-resize__rule" aria-hidden="true" role="none" />
      {withHandle && (
        <span className="tz-resize__grip">
          <Glyph name="grip" />
        </span>
      )}
    </ResizablePrimitive.Separator>
  )
}
