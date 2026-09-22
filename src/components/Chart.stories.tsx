import type { Meta, StoryObj } from '@storybook/react-vite'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts'
import { Cap, Cards } from '../stories/layout'
import { Card, CardText, CardTitle } from './Card'
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from './Chart'

const meta: Meta<typeof ChartContainer> = { title: '手触り / Chart', component: ChartContainer }
export default meta
type Story = StoryObj<typeof ChartContainer>

const data = [
  { month: '4月', 酸化: 42, 還元: 28 },
  { month: '5月', 酸化: 51, 還元: 34 },
  { month: '6月', 酸化: 38, 還元: 41 },
  { month: '7月', 酸化: 27, 還元: 45 },
  { month: '8月', 酸化: 33, 還元: 39 },
  { month: '9月', 酸化: 58, 還元: 36 },
]

const config = {
  酸化: { label: '酸化', color: 'var(--tz-chart-1)' },
  還元: { label: '還元', color: 'var(--tz-chart-3)' },
} satisfies ChartConfig

export const Playground: Story = {
  name: '図',
  render: () => (
    <>
      <Cap>図 — 線 ・ 面 ・ 格 子 に は 筆 の 揺 れ を 通 し 、 文 字 に は 通 さ な い</Cap>
      <Cards min={320}>
        <Card>
          <CardTitle>焼いた点数</CardTitle>
          <CardText>月ごと・焼成ごと</CardText>
          <ChartContainer config={config} className="mt-4">
            <BarChart data={data} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar dataKey="酸化" fill="var(--color-酸化)" radius={3} />
              <Bar dataKey="還元" fill="var(--color-還元)" radius={3} />
            </BarChart>
          </ChartContainer>
        </Card>
        <Card>
          <CardTitle>推移</CardTitle>
          <CardText>線は筆で引いたように揺れる。朱の線は下回ってはいけない目安</CardText>
          <ChartContainer config={config} className="mt-4">
            <LineChart data={data} margin={{ left: 4, right: 12 }} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis width={28} tickLine={false} axisLine={false} />
              <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
              <ReferenceLine
                y={30}
                stroke="var(--tz-chart-attention)"
                strokeDasharray="2 5"
                strokeWidth={1.4}
              />
              <Line
                dataKey="酸化"
                type="natural"
                stroke="var(--color-酸化)"
                strokeWidth={2}
                dot={false}
              />
              <Line
                dataKey="還元"
                type="natural"
                stroke="var(--color-還元)"
                strokeWidth={2}
                strokeDasharray="6 5"
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        </Card>
        <Card>
          <CardTitle>面</CardTitle>
          <CardText>墨を刷いた面</CardText>
          <ChartContainer config={config} className="mt-4">
            <AreaChart data={data} margin={{ left: 4, right: 12 }} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
              <Area
                dataKey="還元"
                type="natural"
                stroke="var(--color-還元)"
                fill="var(--color-還元)"
                fillOpacity={0.12}
                stackId="a"
              />
              <Area
                dataKey="酸化"
                type="natural"
                stroke="var(--color-酸化)"
                fill="var(--color-酸化)"
                fillOpacity={0.1}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        </Card>
      </Cards>
    </>
  ),
}
