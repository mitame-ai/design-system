import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Reseed, Row } from '../stories/layout'
import { Label } from './Label'
import { Switch } from './Switch'

const meta: Meta<typeof Switch> = { title: '手触り / Switch', component: Switch }
export default meta
type Story = StoryObj<typeof Switch>

export const Playground: Story = {
  name: '切り替える',
  render: () => (
    <>
      <Cap>溝 の 中 を 墨 の 玉 が 転 が る — 行 き 過 ぎ て か ら 止 ま る</Cap>
      <Row>
        <div className="flex items-center gap-3">
          <Switch id="s-1" defaultChecked />
          <Label htmlFor="s-1">窯の火を入れる</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="s-2" />
          <Label htmlFor="s-2">通知を受け取る</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="s-3" size="sm" />
          <Label htmlFor="s-3">小さい溝</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="s-4" disabled defaultChecked />
          <Label htmlFor="s-4">変えられない</Label>
        </div>
      </Row>
      <Reseed />
    </>
  ),
}
