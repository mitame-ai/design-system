import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Cap, Reseed } from '../stories/layout'
import { Slider } from './Slider'

const meta: Meta<typeof Slider> = { title: '手触り / Slider', component: Slider }
export default meta
type Story = StoryObj<typeof Slider>

function Temperature() {
  const [v, setV] = useState([1230])
  return (
    <div className="mb-14 max-w-[420px]">
      <p className="m-0 mb-3 text-[13px] tracking-[.08em] text-tz-ink-2">焼成温度 {v[0]}℃</p>
      <Slider value={v} onValueChange={setV} min={800} max={1300} step={10} aria-label="焼成温度" />
    </div>
  )
}

export const Playground: Story = {
  name: '滑らせる',
  render: () => (
    <>
      <Cap>罫 の 上 を 玉 が 滑 る — 選 ん だ 分 だ け 墨 が 染 み る</Cap>
      <Temperature />
      <Cap>範 囲</Cap>
      <div className="mb-14 max-w-[420px]">
        <Slider defaultValue={[20, 65]} aria-label="範囲" />
      </div>
      <Cap>縦 ・ 使 え な い</Cap>
      <div className="mb-14 flex h-[160px] items-stretch gap-12">
        <Slider orientation="vertical" defaultValue={[40]} aria-label="縦" />
        <div className="w-[260px] self-center">
          <Slider disabled defaultValue={[50]} aria-label="使えない" />
        </div>
      </div>
      <Reseed />
    </>
  ),
}
