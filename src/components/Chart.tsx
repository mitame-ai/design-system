import {
  type ComponentProps,
  type ComponentPropsWithoutRef,
  type ComponentType,
  type CSSProperties,
  createContext,
  type ReactNode,
  useContext,
  useId,
} from 'react'
import * as Recharts from 'recharts'
import { useSkin } from '../hooks/useSkin'
import { Shell } from '../lib/slot'
import { cn } from '../lib/utils'

/* =========================================================
   CHART — 図。recharts の線や面を、筆の揺れを通して描く。
     筆   : 線・面・格子には繊維のフィルターを通す。文字には通さない
     墨   : 色は墨の濃淡と朱。系列は、色だけでなく線の種類でも見分けられるようにする
     札   : 値の添え書きは、浮き紙に書く
   ========================================================= */

export type ChartConfig = Record<
  string,
  { label?: ReactNode; icon?: ComponentType } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: { light: string; dark: string } }
  )
>

const Ctx = createContext<{ config: ChartConfig } | null>(null)

export function useChart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useChart は <ChartContainer> の内部で使ってください')
  return c
}

export interface ChartContainerProps extends ComponentPropsWithoutRef<'div'> {
  config: ChartConfig
  children: ComponentProps<typeof Recharts.ResponsiveContainer>['children']
}

export function ChartContainer({ id, className, children, config, ...props }: ChartContainerProps) {
  const uid = useId()
  const chartId = `chart-${id ?? uid.replace(/[^a-zA-Z0-9-]/g, '')}`
  return (
    <Ctx.Provider value={{ config }}>
      <div data-chart={chartId} className={cn('tz-chart', className)} {...props}>
        <ChartStyle id={chartId} config={config} />
        <Recharts.ResponsiveContainer initialDimension={{ width: 320, height: 200 }}>
          {children}
        </Recharts.ResponsiveContainer>
      </div>
    </Ctx.Provider>
  )
}

/** config の色を --color-<key> として流し込む。暗い配色では theme.dark を使う */
export function ChartStyle({ id, config }: { id: string; config: ChartConfig }) {
  const entries = Object.entries(config).filter(([, c]) => c.theme ?? c.color)
  if (!entries.length) return null
  const block = (mode: 'light' | 'dark') =>
    entries
      .map(([key, c]) => {
        const color = c.theme?.[mode] ?? c.color
        return color ? `--color-${key}:${color};` : ''
      })
      .join('')
  return (
    <style
      // biome-ignore lint/security/noDangerouslySetInnerHtml: 設定から組み立てた CSS 変数だけを流し込む
      dangerouslySetInnerHTML={{
        __html: `[data-chart=${id}]{${block('light')}}@media (prefers-color-scheme:dark){[data-chart=${id}]{${block('dark')}}}`,
      }}
    />
  )
}

export const ChartTooltip = Recharts.Tooltip
export const ChartLegend = Recharts.Legend

type Indicator = 'dot' | 'line' | 'dashed'

export interface ChartTooltipContentProps {
  active?: boolean
  payload?: readonly Recharts.TooltipPayloadEntry[]
  label?: ReactNode
  className?: string
  indicator?: Indicator
  hideLabel?: boolean
  hideIndicator?: boolean
  labelFormatter?: (label: ReactNode, payload: readonly Recharts.TooltipPayloadEntry[]) => ReactNode
  formatter?: (
    value: Recharts.TooltipValueType,
    name: string | number,
    item: Recharts.TooltipPayloadEntry,
    index: number,
  ) => ReactNode
  color?: string
  nameKey?: string
  labelKey?: string
}

/** 値の添え書き。浮き紙に、系列の印と値を並べて書く */
export function ChartTooltipContent({
  active,
  payload,
  label,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  labelFormatter,
  formatter,
  color,
  nameKey,
  labelKey,
}: ChartTooltipContentProps) {
  const { config } = useChart()
  const [skin] = useSkin<HTMLDivElement>({ pressable: false })
  if (!active || !payload?.length) return null

  const first = payload[0]
  const labelConf = configFor(
    config,
    first,
    `${labelKey ?? first?.dataKey ?? first?.name ?? 'value'}`,
  )
  const labelValue =
    !labelKey && typeof label === 'string' ? (config[label]?.label ?? label) : labelConf?.label
  const head =
    hideLabel || (!labelValue && !labelFormatter) ? null : (
      <div className="tz-chart-tip__label">
        {labelFormatter ? labelFormatter(labelValue, payload) : labelValue}
      </div>
    )
  const nest = payload.length === 1 && indicator !== 'dot'

  return (
    <div ref={skin} className={cn('tz-leaf tz-chart-tip', className)}>
      <Shell />
      {!nest && head}
      <div className="tz-chart-tip__rows">
        {payload
          .filter((item) => item.type !== 'none')
          .map((item, i) => {
            const key = `${nameKey ?? item.name ?? item.dataKey ?? 'value'}`
            const conf = configFor(config, item, key)
            const tint =
              color ?? (item.payload as { fill?: string } | undefined)?.fill ?? item.color
            return (
              <div
                key={String(item.dataKey ?? key)}
                className={cn('tz-chart-tip__row', `is-${indicator}`)}
              >
                {formatter && item.value !== undefined && item.name !== undefined ? (
                  formatter(item.value, item.name, item, i)
                ) : (
                  <>
                    {conf?.icon ? (
                      <conf.icon />
                    ) : (
                      !hideIndicator && (
                        <span
                          className={cn('tz-chart-tip__ind', `is-${indicator}`)}
                          style={{ '--tz-tint': tint } as CSSProperties}
                        />
                      )
                    )}
                    <div className="tz-chart-tip__pair">
                      <div className="tz-chart-tip__name">
                        {nest && head}
                        <span>{conf?.label ?? item.name}</span>
                      </div>
                      {item.value != null && (
                        <span className="tz-chart-tip__value">
                          {typeof item.value === 'number'
                            ? item.value.toLocaleString()
                            : String(item.value)}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}

export interface ChartLegendContentProps extends ComponentPropsWithoutRef<'div'> {
  payload?: readonly Recharts.LegendPayload[]
  verticalAlign?: 'top' | 'middle' | 'bottom'
  hideIcon?: boolean
  nameKey?: string
}

/** 凡例。系列の名前の前に、その系列の墨の点を打つ */
export function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}: ChartLegendContentProps) {
  const { config } = useChart()
  if (!payload?.length) return null
  return (
    <div
      className={cn('tz-chart-legend', verticalAlign === 'top' ? 'is-top' : 'is-bottom', className)}
    >
      {payload
        .filter((item) => item.type !== 'none')
        .map((item) => {
          const key = `${nameKey ?? item.dataKey ?? 'value'}`
          const conf = configFor(config, item, key)
          return (
            <div key={String(item.value)} className="tz-chart-legend__item">
              {conf?.icon && !hideIcon ? (
                <conf.icon />
              ) : (
                <span
                  className="tz-chart-legend__dot"
                  style={{ '--tz-tint': item.color } as CSSProperties}
                />
              )}
              {conf?.label}
            </div>
          )
        })}
    </div>
  )
}

function configFor(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) return undefined
  const rec = payload as Record<string, unknown>
  const inner =
    typeof rec.payload === 'object' && rec.payload !== null
      ? (rec.payload as Record<string, unknown>)
      : undefined
  let k = key
  if (typeof rec[key] === 'string') k = rec[key] as string
  else if (inner && typeof inner[key] === 'string') k = inner[key] as string
  return k in config ? config[k] : config[key]
}
