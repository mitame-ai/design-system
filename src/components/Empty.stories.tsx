import type { Meta, StoryObj } from '@storybook/react-vite'
import { Glyph } from '../lib/marks'
import { Cap } from '../stories/layout'
import { Button } from './Button'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from './Empty'

const meta: Meta<typeof Empty> = { title: '手触り / Empty', component: Empty }
export default meta
type Story = StoryObj<typeof Empty>

export const Playground: Story = {
  name: '空',
  render: () => (
    <>
      <Cap>空 — ま だ 何 も 書 か れ て い な い 紙 。 枠 は 点 線 の 当 た り 線</Cap>
      <div className="mb-14 max-w-[560px]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Glyph name="file" />
            </EmptyMedia>
            <EmptyTitle>まだ作品がありません</EmptyTitle>
            <EmptyDescription>最初の一客を登録すると、ここに並びます。</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>作品を登録する</Button>
            <Button variant="bare">読み込む</Button>
          </EmptyContent>
        </Empty>
      </div>
    </>
  ),
}
