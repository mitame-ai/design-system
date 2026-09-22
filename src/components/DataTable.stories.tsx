import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap } from '../stories/layout'
import { Badge } from './Badge'
import { DataTable, type DataTableColumn } from './DataTable'

const meta: Meta<typeof DataTable> = { title: '手触り / DataTable', component: DataTable }
export default meta
type Story = StoryObj<typeof DataTable>

interface Work {
  no: string
  name: string
  clay: string
  state: string
  price: number
}

const clays = ['信楽', '備前', '丹波', '唐津', '萩', '天草']
const names = ['湯呑', '片口', '小鉢', '徳利', '平皿', '花入', '飯碗', '急須']
const states = ['窯出し', '乾燥中', '素焼き']
const data: Work[] = Array.from({ length: 23 }, (_, i) => ({
  no: String(401 + i).padStart(4, '0'),
  name: `${['粉引', '焼締', '灰釉', '白磁', '織部'][i % 5]}の${names[i % names.length]}`,
  clay: clays[(i * 7) % clays.length] as string,
  state: states[(i * 5) % states.length] as string,
  price: 2400 + ((i * 1370) % 11000),
}))

const columns: DataTableColumn<Work>[] = [
  { id: 'no', header: '番号', sortable: true, className: 'text-tz-ink-3' },
  { id: 'name', header: '名前', sortable: true },
  { id: 'clay', header: '土', sortable: true },
  {
    id: 'state',
    header: '状態',
    cell: (r) => <Badge variant={r.state === '窯出し' ? 'ink' : 'inlay'}>{r.state}</Badge>,
  },
  {
    id: 'price',
    header: '値',
    sortable: true,
    align: 'end',
    cell: (r) => r.price.toLocaleString(),
  },
]

export const Playground: Story = {
  name: '帳面',
  render: () => (
    <>
      <Cap>帳 面 — 並 べ 替 え ・ 絞 り 込 み ・ 頁 送 り ・ 行 の 選 択</Cap>
      <div className="mb-14">
        <DataTable
          columns={columns}
          data={data}
          getRowId={(r) => r.no}
          filter="名前や土で絞り込む"
          selectable
          pageSize={8}
        />
      </div>
    </>
  ),
}
