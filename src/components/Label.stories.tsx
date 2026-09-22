import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Fields } from '../stories/layout'
import { Input } from './Input'
import { Label } from './Label'
import { Separator } from './Separator'

const meta: Meta<typeof Label> = { title: '手触り / Label', component: Label }
export default meta
type Story = StoryObj<typeof Label>

export const Playground: Story = {
  name: 'ラベルと区切り',
  render: () => (
    <>
      <Cap>ラ ベ ル — 字 間 を 広 く 取 っ た 、 控 え め な 見 出 し</Cap>
      <Fields>
        <div>
          <Label htmlFor="l-name">屋 号</Label>
          <Input id="l-name" placeholder="例 : 土と火" />
        </div>
      </Fields>
      <Cap>区 切 り — 手 で 引 い た 罫 。 縦 に も 引 け る</Cap>
      <div className="mb-14 max-w-[420px]">
        <p className="m-0 text-[14px] tracking-[.06em]">手触り</p>
        <p className="m-0 text-[12.5px] tracking-[.04em] text-tz-ink-2">有機的な温かみを持つ UI</p>
        <Separator className="my-4" />
        <div className="flex h-5 items-center text-[13px] tracking-[.06em] text-tz-ink-2">
          <span>器</span>
          <Separator orientation="vertical" />
          <span>道具</span>
          <Separator orientation="vertical" />
          <span>窯</span>
        </div>
      </div>
    </>
  ),
}
