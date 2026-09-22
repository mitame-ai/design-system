import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Row } from '../stories/layout'
import { Button } from './Button'
import { Kbd, KbdGroup } from './Kbd'

const meta: Meta<typeof Kbd> = { title: '手触り / Kbd', component: Kbd }
export default meta
type Story = StoryObj<typeof Kbd>

export const Playground: Story = {
  name: '木の札',
  render: () => (
    <>
      <Cap>キ ー — 木 の 札 。 押 さ れ る の は 本 物 の キ ー な の で 、 札 は 応 え な い</Cap>
      <Row>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <span className="text-[13px] tracking-[.05em] text-tz-ink-2">
          保存は <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd> で
        </span>
        <Button>
          索引を開く <Kbd>⌘K</Kbd>
        </Button>
      </Row>
    </>
  ),
}
