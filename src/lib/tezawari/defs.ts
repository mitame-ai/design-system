import { canPaint } from './env'

const DEFS_ID = 'tz-defs'

/**
 * 紙の繊維とアイコンの歪みに使うフィルタを、文書に一度だけ置く。
 * `filter="url(#tz-fiber-g)"` は文書スコープなので、どこかに一つあればよい。
 */
export function ensureDefs() {
  if (!canPaint()) return
  if (document.getElementById(DEFS_ID)) return
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.id = DEFS_ID
  svg.setAttribute('class', 'tz-defs')
  svg.setAttribute('aria-hidden', 'true')
  svg.innerHTML = `<filter id="tz-paper-grain">
<feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" seed="3"/>
<feColorMatrix type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1"/>
</filter>
<filter id="tz-fiber-g" x="-25%" y="-25%" width="150%" height="150%">
<feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="21" result="t"/>
<feDisplacementMap in="SourceGraphic" in2="t" scale="1.2" xChannelSelector="R" yChannelSelector="G"/>
</filter>`
  document.body.prepend(svg)
}
