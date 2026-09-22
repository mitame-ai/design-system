import { basePoints, normals, organic, toPath } from './geometry'
import { clamp, cssv, fnv, mulberry32, num, wobbler } from './random'
import type { Form, Point, Skin } from './types'

/**
 * 描画エンジン — ボタン、カード、入力欄、パネルの各コンポーネントを共通のロジックで SVG 描画する。
 * コンポーネントごとの違いは要素に付与された CSS トークンのみによって決まる。
 *
 * @returns 実際に再描画が行われた場合のみ true
 */
export function paint(st: Skin, salt: number): boolean {
  const el = st.el
  const w = Math.round(el.offsetWidth)
  const h = Math.round(el.offsetHeight)
  /* 寸法が取得できない要素（display:none の親要素配下など）は描画をスキップ */
  if (!w || !h) return false
  if (st.w === w && st.h === h && st.salt === salt) return false
  st.w = w
  st.h = h
  st.salt = salt

  const seed = fnv(`${st.key}|${salt}`)
  const rand = mulberry32(seed)
  const pad = (st.pad = num(el, '--tz-pad'))
  const W = w + pad * 2
  const H = h + pad * 2

  const grit = num(el, '--tz-grit')
  const amp = num(el, '--tz-amp')
  const fiber = cssv(el, '--tz-fiber')
  const gfreq = cssv(el, '--tz-grain-freq')
  const goct = cssv(el, '--tz-grain-oct')
  const roff = num(el, '--tz-ring-off')
  /* 粗い輪郭ほど高周波成分を含むため、解像度に合わせて細かくサンプリングする */
  const step = clamp(8 / Math.sqrt(grit), 3.2, 8)
  const round = el.classList.contains('tz--icon')
    ? Math.min(w, h) / 2
    : num(el, '--tz-radius') * (0.88 + rand() * 0.24)

  const form = (cssv(el, '--tz-form') || 'box') as Form
  let corr = ''
  let lines = ''
  let hooks = ''
  let stack = ''

  if (form === 'rule') {
    /* 罫線（rule）：閉じた輪郭ではなく、下端を走る一本の水平線 */
    const y = pad + h
    const x0 = pad - 4
    const x1 = pad + w + 4
    const n = Math.max(10, Math.round((x1 - x0) / step))
    const wob = wobbler(rand, grit)
    st.base = []
    for (let i = 0; i <= n; i++) st.base.push([x0 + ((x1 - x0) * i) / n, y + wob(i / n / 2) * amp])
    st.closed = false

    /* かぎ（hook）：罫線の両端で筆が上向きに跳ねる形状 */
    const tick = (q: Point, dir: number) => {
      const j = (rand() - 0.5) * 1.1
      const up = 8.4 + rand() * 1.6
      return (
        `M${q[0].toFixed(2)},${(q[1] + 1.2).toFixed(2)}` +
        `C${(q[0] + dir * 0.5).toFixed(2)},${(q[1] - up * 0.38).toFixed(2)}` +
        ` ${(q[0] + dir * (1.6 + j)).toFixed(2)},${(q[1] - up * 0.68).toFixed(2)}` +
        ` ${(q[0] + dir * (3.1 + j)).toFixed(2)},${(q[1] - up).toFixed(2)}`
      )
    }
    hooks = tick(st.base[0] as Point, 1) + tick(st.base[st.base.length - 1] as Point, -1)

    /* 重なり：罫線の下から次項目の縁がわずかに覗く表現 */
    const deck = num(el, '--tz-stack') || 0
    if (deck) {
      let sp = ''
      for (let k = 1; k <= deck; k++) {
        const wob2 = wobbler(rand, grit)
        const inset = 8 * k
        const pts: Point[] = []
        const a = (st.base[0] as Point)[0] + inset
        const b = (st.base[st.base.length - 1] as Point)[0] - inset
        const m = Math.max(6, Math.round((b - a) / step))
        for (let i = 0; i <= m; i++)
          pts.push([a + ((b - a) * i) / m, y + 3.4 * k + wob2(i / m / 2) * amp * 0.7])
        sp += `<path d="${toPath(pts, false)}" style="--k:${k}"/>`
      }
      stack = `<g class="tz-stack">${sp}</g>`
    }

    /* 朱入れ：罫線の直下に引かれる訂正の波線 */
    const cyc = Math.max(3, Math.round(w / 13))
    const jit = wobbler(rand, 2)
    corr = toPath(
      st.base.map((q, i) => {
        const t = i / (st.base.length - 1)
        return [q[0], q[1] + 5.5 + Math.sin(t * Math.PI * 2 * cyc) * 2.1 + jit(t / 2) * 0.6]
      }),
      false,
    )
  } else {
    const raw = basePoints(pad, pad, w, h, round, step)
    st.base = organic(raw, normals(raw), wobbler(rand, grit), amp)
    st.closed = true
  }
  st.norm = normals(st.base, st.closed)
  st.d0 = toPath(st.base, st.closed)

  /* 原稿用紙（ruled）：領域内に行数分の罫線を引く */
  const ctl = el.querySelector('input, textarea') as HTMLElement | null
  if (form === 'ruled' && ctl) {
    const cs = getComputedStyle(ctl)
    const lh = Number.parseFloat(cs.lineHeight) || 28
    const top = ctl.offsetTop + Number.parseFloat(cs.paddingTop)
    const x0 = pad + ctl.offsetLeft + Number.parseFloat(cs.paddingLeft)
    const x1 = pad + ctl.offsetLeft + ctl.offsetWidth - Number.parseFloat(cs.paddingRight)
    const wob = wobbler(rand, 3)
    let out = ''
    for (let r = 1; top + lh * r < h - 4; r++) {
      const y = pad + top + lh * r - 4
      const n = Math.max(6, Math.round((x1 - x0) / 11))
      const pts: Point[] = []
      for (let i = 0; i <= n; i++)
        pts.push([x0 + ((x1 - x0) * i) / n, y + wob((i / n + r * 0.37) / 2) * 1.1])
      out += `<path d="${toPath(pts, false)}"/>`
    }
    lines = `<g class="tz-lines">${out}</g>`
  }

  /* フォーカスリングは独立した輪郭を参照（たわみ変形でフォーカス枠まで歪むのを防止） */
  const rawR = basePoints(pad - roff, pad - roff, w + roff * 2, h + roff * 2, round + roff, step)
  const ring = toPath(organic(rawR, normals(rawR), wobbler(rand, grit), amp * 0.9))

  /* 筆圧の表現：輪郭線に太い破線を重ねて手描きの墨だまりを演出 */
  const dash: string[] = []
  for (let acc = 0, per = 2 * (w + h) + 60; acc < per; ) {
    const d = 9 + rand() * 48
    const g = 7 + rand() * 34
    dash.push(d.toFixed(1), g.toFixed(1))
    acc += d + g
  }

  const id = st.id
  const s1 = seed % 991
  const s2 = (seed >>> 5) % 991
  const blur = (2 + Math.min(w, h) * 0.026).toFixed(1)

  /* 紙の耳（毛羽立ち）：位置によって不規則な濃度変化を付与 */
  const fray: string[] = []
  for (let acc = 0, per = 2 * (w + h) + 80; acc < per; ) {
    const d = 18 + rand() * 90
    const g = 8 + rand() * 34
    fray.push(d.toFixed(1), g.toFixed(1))
    acc += d + g
  }

  el.style.setProperty('--tz-rot', `${((rand() - 0.5) * (grit > 2 ? 0.34 : 0.7)).toFixed(3)}deg`)
  el.style.setProperty('--tz-baseline', `${((rand() - 0.5) * 0.8).toFixed(2)}px`)
  /* 息（微細なゆらぎ）：面積の大きい要素ほど長周期で穏やかに呼吸する */
  const slow = Math.min(2.2, 1 + Math.min(w, h) / 260)
  el.style.setProperty('--tz-breath-dur', `${((13 + rand() * 9) * slow).toFixed(1)}s`)
  el.style.setProperty('--tz-breath-delay', `${(-rand() * 30).toFixed(1)}s`)
  st.drawDur = 540 + rand() * 420
  st.drawJit = rand() * 90

  st.shell.innerHTML = `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="tzf${id}" x="-20%" y="-20%" width="140%" height="140%">
<feTurbulence type="fractalNoise" baseFrequency="${(0.015 * grit).toFixed(4)} ${(0.023 * grit).toFixed(4)}" numOctaves="2" seed="${s1}" result="t"/>
<feDisplacementMap in="SourceGraphic" in2="t" scale="${fiber}" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="tzg${id}" x="0" y="0" width="100%" height="100%">
<feTurbulence type="fractalNoise" baseFrequency="${gfreq}" numOctaves="${goct}" seed="${s2}" result="n"/>
<feColorMatrix in="n" type="matrix" values="1 0 0 0 0  1 0 0 0 0  1 0 0 0 0  0 0 0 0 1" result="m"/>
<feComposite in="m" in2="SourceGraphic" operator="in"/>
</filter>
<filter id="tzs${id}" x="-30%" y="-30%" width="160%" height="160%">
<feGaussianBlur stdDeviation="${blur}"/>
</filter>
<filter id="tzb${id}" x="-20%" y="-20%" width="140%" height="140%">
<feGaussianBlur stdDeviation="1.15"/>
</filter>
<radialGradient id="tzp${id}" gradientUnits="userSpaceOnUse" cx="-999" cy="-999" r="${(Math.max(w, h) * 0.85).toFixed(0)}">
<stop class="tz-s0" offset="0"/><stop class="tz-s1" offset="1"/>
</radialGradient>
<path id="tzd${id}" d="${st.d0}"/>
<path id="tzq${id}" d="${ring}"/>
${corr ? `<path id="tzc${id}" d="${corr}"/>` : ''}
</defs>
<use class="tz-shade" href="#tzd${id}" filter="url(#tzs${id})"/>
<g filter="url(#tzf${id})">
<use class="tz-fill" href="#tzd${id}"/>
<use class="tz-press" href="#tzd${id}" fill="url(#tzp${id})"/>
<use class="tz-grain" href="#tzd${id}" filter="url(#tzg${id})"/>
<use class="tz-edge2" href="#tzd${id}" stroke-dasharray="${dash.join(' ')}" stroke-dashoffset="${(rand() * 160).toFixed(1)}"/>
<use class="tz-soak" href="#tzd${id}"/>
<use class="tz-edge" href="#tzd${id}"/>
${corr ? `<use class="tz-correct" href="#tzc${id}"/>` : ''}
${hooks ? `<path class="tz-hook" d="${hooks}"/>` : ''}
${stack}
${lines}
<use class="tz-fringe" href="#tzd${id}" filter="url(#tzb${id})" stroke-dasharray="${fray.join(' ')}" stroke-dashoffset="${(rand() * 90).toFixed(1)}"/>
<use class="tz-ring" href="#tzq${id}"/>
</g></svg>`

  st.grad = st.shell.querySelector('radialGradient')
  /* 輪郭パスは単一の定義を保持し、各描画レイヤーが <use> で参照する。
     変形時は参照元のパスを1度更新するだけで全レイヤーに反映される */
  st.silhouette = st.shell.querySelector(`#tzd${id}`)
  st.len = Math.ceil(st.silhouette?.getTotalLength() ?? 0)
  el.style.setProperty('--tz-len', String(st.len))
  const cp = st.shell.querySelector<SVGPathElement>(`#tzc${id}`)
  if (cp) el.style.setProperty('--tz-clen', String(Math.ceil(cp.getTotalLength())))
  st.dkey = ''
  return true
}

/** 手描き風の水平罫線を描画する */
export function paintRule(el: HTMLElement, index: number, salt: number) {
  const w = Math.round(el.offsetWidth) || 200
  const h = Math.round(el.offsetHeight) || 9
  const rand = mulberry32(fnv(`rule${index}|${salt}`))
  const wob = wobbler(rand, 2)
  const n = Math.max(6, Math.round(w / 9))
  const f = (v: number) => v.toFixed(2)
  const y = h / 2
  const pts: Point[] = []
  for (let i = 0; i <= n; i++) pts.push([1 + ((w - 2) * i) / n, y + wob(i / n / 2) * (h / 2 - 0.8)])
  let d = `M${f((pts[0] as Point)[0])},${f((pts[0] as Point)[1])}`
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1] as Point
    const q = pts[i] as Point
    const mx = (p[0] + q[0]) / 2
    d += `Q${f(mx)},${f(p[1])} ${f(q[0])},${f(q[1])}`
  }
  el.innerHTML =
    `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">` +
    `<path d="${d}" stroke-dasharray="${(30 + rand() * 60).toFixed(0)} ${(2 + rand() * 4).toFixed(1)} ` +
    `${(40 + rand() * 80).toFixed(0)} ${(2 + rand() * 5).toFixed(1)}"/></svg>`
}
