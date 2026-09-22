import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Reseed } from '../stories/layout'
import { Panel } from './Panel'

const meta = {
  title: '手触り / Panel',
  component: Panel,
} satisfies Meta<typeof Panel>

export default meta
type Story = StoryObj<typeof meta>

export const Weave: Story = {
  name: '織り',
  render: () => (
    <>
      <Cap>織 り — 方向を持つ繊維の面。外部の画像を持たない</Cap>
      <div className="mb-14 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-6">
        <Panel className="h-[104px]" />
        <Panel className="h-[104px]" />
        <Panel className="h-[104px]" />
      </div>
      <Cap>大 き さ — 粗さは寸法で変わらない。目の細かさは同じ</Cap>
      <div className="mb-14 flex flex-wrap items-end gap-6">
        <Panel className="h-[56px] w-[120px]" />
        <Panel className="h-[104px] w-[220px]" />
        <Panel className="h-[160px] w-[340px]" />
      </div>
      <Reseed />
    </>
  ),
}
