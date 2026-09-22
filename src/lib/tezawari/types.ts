export type Point = [number, number]

export type Form = 'box' | 'rule' | 'vrule' | 'ruled'

/** 各コンポーネント個体の状態管理データ。index.html の `el.__tz` に相当 */
export interface Skin {
  el: HTMLElement
  /** シェル要素。全 SVG レイヤーはこの内部に生成される */
  shell: HTMLElement
  /** SVG の id を一意にするための連番 */
  id: number
  /** 輪郭のシード値。同一の key であれば再読み込み後も同一形状を再現 */
  key: string
  /** key のうち、DOM インデックスを除いた基本識別子 */
  baseKey: string
  /** 同一の baseKey を持つ要素群の中での DOM 出現順インデックス */
  slot: number
  /** 登場アニメーションの順序（46ms ごとにずらして実行） */
  birth: number

  w: number
  h: number
  pad: number
  salt: number
  /** 経年変化（使い込み）カウンター。インタラクションごとに加算（最大 12） */
  wear: number
  /** 気配（カーソル接近）の反応強度 */
  near: number
  /** インタラクティブな操作対象かどうか */
  live: boolean
  pressable: boolean

  base: Point[]
  norm: Point[]
  closed: boolean
  d0: string
  /** 直近で適用した transform の丸め値（変更がない場合の再描画スキップ用） */
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
  /** 解放開始時点の深さ */
  d1: number
  phase: 'press' | 'release'
  t0: number
  raf: number

  drawDur: number
  drawJit: number

  settleTO: ReturnType<typeof setTimeout> | null
  scribeTO: ReturnType<typeof setTimeout> | null

  /** フィールドに内包される input / textarea / select 要素 */
  ctl: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null
  /** セレクトフィールド：選択されたテキスト幅をインク描画に反映 */
  pick: boolean
}

export interface TezawariOptions {
  /** 輪郭のシード値を明示的に固定（同一 seed で同一形状を再現） */
  seed?: string
  /** 押下アニメーションを有効にするかどうか（未指定時は tagName や tabindex から自動判定） */
  pressable?: boolean
}
