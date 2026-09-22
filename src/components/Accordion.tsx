import { Accordion as AccordionPrimitive } from 'radix-ui'
import { type ComponentPropsWithoutRef, forwardRef } from 'react'
import { Glyph } from '../lib/marks'
import { cn } from '../lib/utils'
import { Rule } from './Rule'

/**
 * 折り — 畳まれた紙を一段ずつ開く。
 * 段の境目は手で引いた罫。開くと中の文字が、紙が落ち着いてから読めるようになる。
 */
export const Accordion = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>
>(function Accordion({ className, ...props }, ref) {
  return <AccordionPrimitive.Root ref={ref} className={cn('tz-fold', className)} {...props} />
})

export const AccordionItem = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>
>(function AccordionItem({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Item ref={ref} className={cn('tz-fold__item', className)} {...props}>
      {children}
      <Rule className="tz-fold__rule" aria-hidden="true" role="none" />
    </AccordionPrimitive.Item>
  )
})

export const AccordionTrigger = forwardRef<
  HTMLButtonElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(function AccordionTrigger({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Header className="tz-fold__header">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn('tz-fold__trigger', className)}
        {...props}
      >
        <span className="tz-fold__label">{children}</span>
        <Glyph name="turn" className="tz-fold__turn" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
})

export const AccordionContent = forwardRef<
  HTMLDivElement,
  ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(function AccordionContent({ className, children, ...props }, ref) {
  return (
    <AccordionPrimitive.Content ref={ref} className="tz-fold__content" {...props}>
      <div className={cn('tz-fold__body', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
})
