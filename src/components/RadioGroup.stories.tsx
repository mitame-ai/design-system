import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Reseed } from '../stories/layout'
import { RadioGroup, RadioGroupItem } from './RadioGroup'

const meta: Meta<typeof RadioGroup> = { title: '手触り / RadioGroup', component: RadioGroup }
export default meta
type Story = StoryObj<typeof RadioGroup>

export const Playground: Story = {
  name: '選ぶ',
  render: () => (
    <>
      <Cap>丸 に 墨 を 一 滴 — 選 び 直 す と 滴 が 移 る</Cap>
      <RadioGroup defaultValue="還元" className="mb-14" aria-label="焼成">
        {['酸化', '還元', '焼締', '楽焼'].map((t) => (
          <label key={t} className="tz-choice">
            <RadioGroupItem value={t} disabled={t === '楽焼'} />
            {t}
          </label>
        ))}
      </RadioGroup>
      <Reseed />
    </>
  ),
}
