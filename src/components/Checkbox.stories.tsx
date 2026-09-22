import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Reseed } from '../stories/layout'
import { Checkbox } from './Checkbox'
import { Label } from './Label'

const meta: Meta<typeof Checkbox> = { title: '手触り / Checkbox', component: Checkbox }
export default meta
type Story = StoryObj<typeof Checkbox>

export const Playground: Story = {
  name: '書き入れる',
  render: () => (
    <>
      <Cap>枡 に 印 を 書 き 入 れ る — 印 は 少 し は み 出 す</Cap>
      <div className="mb-14 grid gap-4">
        {['轆轤で挽く', '手びねりで作る', '型に押す'].map((t, i) => (
          <label key={t} className="tz-choice">
            <Checkbox defaultChecked={i === 0} />
            {t}
          </label>
        ))}
        <label className="tz-choice">
          <Checkbox defaultChecked="indeterminate" />
          一部だけ釉を掛ける
        </label>
        <label className="tz-choice">
          <Checkbox disabled />
          窯を借りる（受付終了）
        </label>
      </div>
      <Cap>ラ ベ ル と 組 む</Cap>
      <div className="mb-14 flex items-center gap-3">
        <Checkbox id="agree" />
        <Label htmlFor="agree">注意事項を読みました</Label>
      </div>
      <Reseed />
    </>
  ),
}
