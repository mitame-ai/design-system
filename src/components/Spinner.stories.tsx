import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Row } from '../stories/layout'
import { Badge } from './Badge'
import { Spinner } from './Spinner'

const meta: Meta<typeof Spinner> = { title: '手触り / Spinner', component: Spinner }
export default meta
type Story = StoryObj<typeof Spinner>

export const Playground: Story = {
  name: '待ち',
  render: () => (
    <>
      <Cap>待 ち — 針 目 が 輪 を 回 る 。 引 き 、 止 め 、 ま た 引 く</Cap>
      <Row>
        <Spinner />
        <Spinner className="text-[28px]" />
        <span className="flex items-center gap-2 text-[13px] tracking-[.05em] text-tz-ink-2">
          <Spinner /> 窯を温めています
        </span>
        <Badge variant="contour">
          <Spinner /> 送っています
        </Badge>
      </Row>
    </>
  ),
}
