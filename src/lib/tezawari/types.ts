export type Point = [number, number]

export type Form = 'box' | 'rule' | 'ruled'

/** 一つの個体が憶えていること。index.html の `el.__tz` に相当する。 */
export interface Skin {
  el: HTMLElement
  /** 殻。SVG の層はすべてここに書き込まれる */
  shell: HTMLElement
  /** SVG の id を分けるための連番 */
  id: number
  /** 輪郭の種。同じ key なら再読み込みしても同じ形に戻る */
  key: string
  /** key のうち、席の番号を除いた部分 */
  baseKey: string
  /** 同じ baseKey を持つ個体のなかでの席 */
  slot: number
  /** 描き出しの順。46ms ずつずれて生まれる */
  birth: number

  w: number
  h: number
  pad: number
  salt: number
  /** 使い込み。触れるたび 12 まで増える */
  wear: number
  /** 気配の強さ */
  near: number
  /** 触れられる物か。触れられない物は応えない */
  live: boolean
  pressable: boolean

  base: Point[]
  norm: Point[]
  closed: boolean
  d0: string
  /** 最後に書いた変形の丸め値。同じなら書き直さない */
  dkey: string
  len: number
  silhouette: SVGPathElement | null
  grad: SVGElement | null

  pressD: number
  liftD: number
  pressW: number[] | null
  liftW: number[] | null
  corner: string
  /** たわみの深さの目標値 */
  D: number
  /** 解放が始まった時点の深さ */
  d1: number
  phase: 'press' | 'release'
  t0: number
  raf: number

  drawDur: number
  drawJit: number

  settleTO: ReturnType<typeof setTimeout> | null
  scribeTO: ReturnType<typeof setTimeout> | null

  /** 欄が抱えている入力要素 */
  ctl: HTMLInputElement | HTMLTextAreaElement | null
  /** 選ぶ欄は、選んだ言葉の幅を墨にする */
  pick: boolean
}

export interface TezawariOptions {
  /** 輪郭の種を明示的に固定する。同じ seed は同じ形になる */
  seed?: string
  /** 押される物か。既定では tagName と tabindex から決める */
  pressable?: boolean
}
