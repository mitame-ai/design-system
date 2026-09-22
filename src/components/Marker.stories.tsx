import type { Meta, StoryObj } from '@storybook/react-vite'
import { Glyph } from '../lib/marks'
import { Cap } from '../stories/layout'
import { Marker, MarkerContent, MarkerIcon } from './Marker'

const meta: Meta<typeof Marker> = { title: '手触り / Marker', component: Marker }
export default meta
type Story = StoryObj<typeof Marker>

export const Playground: Story = {
  name: '目印',
  render: () => (
    <>
      <Cap>目 印 — 流 れ の 中 に 置 く 小 さ な 注 記</Cap>
      <div className="mb-14 grid max-w-[560px] gap-8">
        <Marker>
          <MarkerIcon>
            <Glyph name="info" />
          </MarkerIcon>
          <MarkerContent>
            窯の温度を 1230℃ に変えました · <a href="#m">元に戻す</a>
          </MarkerContent>
        </Marker>
        <Marker variant="separator">
          <MarkerContent>9 月 21 日</MarkerContent>
        </Marker>
        <Marker variant="border">
          <MarkerContent>ここから新しい話題</MarkerContent>
        </Marker>
      </div>
    </>
  ),
}
