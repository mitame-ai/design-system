import { Direction as DirectionPrimitive } from 'radix-ui'
import type { ReactNode } from 'react'

export interface DirectionProviderProps {
  /** 文字の流れ。ltr（左から右）または rtl（右から左） */
  dir?: 'ltr' | 'rtl'
  /** dir の別名（shadcn の API に合わせたもの） */
  direction?: 'ltr' | 'rtl'
  children?: ReactNode
}

/** 文字の流れを子孫の部品に伝える。メニューやスライダーの向きがこれに従う */
export function DirectionProvider({ dir, direction, children }: DirectionProviderProps) {
  return (
    <DirectionPrimitive.Provider dir={direction ?? dir ?? 'ltr'}>
      {children}
    </DirectionPrimitive.Provider>
  )
}

export const useDirection = DirectionPrimitive.useDirection
