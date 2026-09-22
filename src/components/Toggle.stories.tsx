import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Reseed, Row } from '../stories/layout'
import { Icon } from './Icon'
import { Toggle } from './Toggle'
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'

const meta: Meta<typeof Toggle> = { title: '手触り / Toggle', component: Toggle }
export default meta
type Story = StoryObj<typeof Toggle>

const Bold = () => (
  <Icon>
    <path d="M4.6 2.9 C6.8 2.8 8.9 2.7 9.9 3.6 C11.2 4.8 10.6 7.3 8.4 7.6 C10.8 7.7 12 9.3 11.2 11.2 C10.4 13 7.6 13.1 4.7 13 C4.6 9.6 4.7 6.2 4.6 2.9 M4.8 7.7 L8.3 7.7" />
  </Icon>
)
const Italic = () => (
  <Icon>
    <path d="M7.1 3.1 L11.9 2.9 M4.1 13 L8.9 12.9 M9.6 3.1 C8.6 6.4 7.5 9.6 6.4 12.9" />
  </Icon>
)
const Under = () => (
  <Icon>
    <path d="M4.3 2.9 C4.2 6.2 4.4 9.6 8 9.7 C11.6 9.8 11.8 6.3 11.7 3 M3.4 13.1 C6.4 12.9 9.6 13.1 12.6 12.9" />
  </Icon>
)

export const Playground: Story = {
  name: '押し込む',
  render: () => (
    <>
      <Cap>押 す と 沈 ん だ ま ま 残 る — 色 で は な く へ こ み で 示 す</Cap>
      <Row>
        <Toggle aria-label="太字" size="icon">
          <Bold />
        </Toggle>
        <Toggle variant="contour" defaultPressed>
          下書きを残す
        </Toggle>
        <Toggle variant="contour">写しを取る</Toggle>
        <Toggle disabled>使えない</Toggle>
      </Row>
      <Cap>組 — 一 つ だ け 、 ま た は 幾 つ で も</Cap>
      <Row>
        <ToggleGroup type="multiple" size="icon" defaultValue={['b']} aria-label="書式">
          <ToggleGroupItem value="b" aria-label="太字">
            <Bold />
          </ToggleGroupItem>
          <ToggleGroupItem value="i" aria-label="斜体">
            <Italic />
          </ToggleGroupItem>
          <ToggleGroupItem value="u" aria-label="下線">
            <Under />
          </ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup type="single" variant="contour" size="sm" defaultValue="月" aria-label="期間">
          {['日', '週', '月', '年'].map((t) => (
            <ToggleGroupItem key={t} value={t}>
              {t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Row>
      <Reseed />
    </>
  ),
}
