import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Cards } from '../stories/layout'
import { Card } from './Card'
import { Skeleton } from './Skeleton'

const meta: Meta<typeof Skeleton> = { title: '手触り / Skeleton', component: Skeleton }
export default meta
type Story = StoryObj<typeof Skeleton>

export const Playground: Story = {
  name: '下書き',
  render: () => (
    <>
      <Cap>
        下 書 き — 墨 を 入 れ る 前 の 当 た り 線 。 紙 が 湿 る よ う に 満 ち 引 き す る
      </Cap>
      <div className="mb-14 flex max-w-[420px] items-center gap-4">
        <Skeleton className="size-12 shrink-0 rounded-full" />
        <div className="grid flex-1 gap-2.5">
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="h-3.5 w-3/5" />
        </div>
      </div>
      <Cards>
        <Card>
          <Skeleton className="mb-5 h-[104px]" />
          <Skeleton className="mb-3 h-4 w-2/5" />
          <Skeleton className="mb-2 h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </Card>
      </Cards>
    </>
  ),
}
