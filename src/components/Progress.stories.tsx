import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { Cap } from '../stories/layout'
import { Progress } from './Progress'

const meta: Meta<typeof Progress> = { title: '手触り / Progress', component: Progress }
export default meta
type Story = StoryObj<typeof Progress>

function Filling() {
  const [v, setV] = useState(12)
  useEffect(() => {
    const t = setInterval(() => setV((x) => (x >= 100 ? 8 : x + 17)), 1400)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="mb-14 grid max-w-[420px] gap-3">
      <span className="text-[12px] tracking-[.12em] text-tz-ink-3">乾燥 {Math.min(v, 100)}%</span>
      <Progress value={v} aria-label="乾燥" />
    </div>
  )
}

export const Playground: Story = {
  name: '進み',
  render: () => (
    <>
      <Cap>進 み — 罫 に 、 進 ん だ 分 だ け 墨 が 染 み る</Cap>
      <Filling />
      <Cap>待 ち — 値 が 決 ま ら な い あ い だ は 、 針 目 が 罫 の 上 を 進 む</Cap>
      <div className="mb-14 max-w-[420px]">
        <Progress value={null} aria-label="準備中" />
      </div>
    </>
  ),
}
