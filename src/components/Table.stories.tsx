import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap } from '../stories/layout'
import { Badge } from './Badge'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from './Table'

const meta: Meta<typeof Table> = { title: '手触り / Table', component: Table }
export default meta
type Story = StoryObj<typeof Table>

const rows = [
  { no: '0412', name: '粉引の湯呑', clay: '信楽', state: '窯出し', price: 4800 },
  { no: '0413', name: '焼締の片口', clay: '備前', state: '乾燥中', price: 9200 },
  { no: '0414', name: '灰釉の小鉢', clay: '丹波', state: '窯出し', price: 3600 },
  { no: '0415', name: '白磁の徳利', clay: '天草', state: '素焼き', price: 12000 },
]

export const Playground: Story = {
  name: '表',
  render: () => (
    <>
      <Cap>表 — 罫 は 表 全 体 で 一 度 に 引 く 。 見 出 し の 下 だ け 筆 圧 を 強 く</Cap>
      <div className="mb-14">
        <Table>
          <TableCaption>9 月の窯入れ分</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>番号</TableHead>
              <TableHead>名前</TableHead>
              <TableHead>土</TableHead>
              <TableHead>状態</TableHead>
              <TableHead className="text-right">値</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.no}>
                <TableCell className="text-tz-ink-3">{r.no}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.clay}</TableCell>
                <TableCell>
                  <Badge variant={r.state === '窯出し' ? 'ink' : 'inlay'}>{r.state}</Badge>
                </TableCell>
                <TableCell className="text-right">{r.price.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>計</TableCell>
              <TableCell className="text-right">
                {rows.reduce((s, r) => s + r.price, 0).toLocaleString()}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </>
  ),
}
