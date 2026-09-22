import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap } from '../stories/layout'
import { Card } from './Card'
import { ScrollArea } from './ScrollArea'
import { Separator } from './Separator'

const meta: Meta<typeof ScrollArea> = { title: '手触り / ScrollArea', component: ScrollArea }
export default meta
type Story = StoryObj<typeof ScrollArea>

const tags = Array.from(
  { length: 40 },
  (_, i) => `第 ${i + 1} 窯 — ${['信楽', '備前', '丹波', '萩'][i % 4]}`,
)

export const Playground: Story = {
  name: '巻物',
  render: () => (
    <>
      <Cap>巻 物 — つ ま み は 筆 で 引 い た 一 画</Cap>
      <div className="mb-14 max-w-[300px]">
        <Card variant="inlay" className="p-0">
          <ScrollArea className="h-[260px]">
            <div className="px-5 py-4">
              <p className="m-0 mb-2 text-[13px] font-semibold tracking-[.1em]">窯の記録</p>
              {tags.map((t) => (
                <div key={t}>
                  <p className="m-0 py-1 text-[13px] tracking-[.04em] text-tz-ink-2">{t}</p>
                  <Separator className="my-1" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </>
  ),
}
