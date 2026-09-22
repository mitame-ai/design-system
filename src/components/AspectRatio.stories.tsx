import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap } from '../stories/layout'
import { AspectRatio } from './AspectRatio'
import { DirectionProvider } from './Direction'
import { Panel } from './Panel'
import { Slider } from './Slider'

const meta: Meta<typeof AspectRatio> = { title: '手触り / AspectRatio', component: AspectRatio }
export default meta
type Story = StoryObj<typeof AspectRatio>

export const Playground: Story = {
  name: '縦横比・文字の流れ',
  render: () => (
    <>
      <Cap>縦 横 比 — 16 : 9 の 枠 に パ ネ ル を 置 く</Cap>
      <div className="mb-14 max-w-[420px]">
        <AspectRatio ratio={16 / 9}>
          <Panel className="h-full" />
        </AspectRatio>
      </div>
      <Cap>
        文 字 の 流 れ — 右 か ら 左 へ 流 れ る 文 脈 で は 、 目 盛 り も 右 か ら 染 み る
      </Cap>
      <DirectionProvider dir="rtl">
        <div dir="rtl" className="mb-14 max-w-[420px]">
          <Slider defaultValue={[35]} aria-label="右から左" />
        </div>
      </DirectionProvider>
    </>
  ),
}
