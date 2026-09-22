import type { Meta, StoryObj } from '@storybook/react-vite'
import { Glyph } from '../lib/marks'
import { Cap, Row } from '../stories/layout'
import { Button } from './Button'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from './ButtonGroup'
import { Input } from './Input'

const meta: Meta<typeof ButtonGroup> = { title: '手触り / ButtonGroup', component: ButtonGroup }
export default meta
type Story = StoryObj<typeof ButtonGroup>

export const Playground: Story = {
  name: '組',
  render: () => (
    <>
      <Cap>組 — 器 を 寄 せ て 並 べ る 。 継 ぎ 目 は 溶 接 し な い</Cap>
      <Row>
        <ButtonGroup aria-label="編集">
          <Button variant="contour" size="sm">
            写す
          </Button>
          <Button variant="contour" size="sm">
            貼る
          </Button>
          <ButtonGroupSeparator />
          <Button variant="contour" size="icon-sm" aria-label="ほか">
            <Glyph name="more" />
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="数量">
          <Button variant="bare" size="icon-sm" aria-label="減らす">
            <Glyph name="minus" />
          </Button>
          <ButtonGroupText>3 点</ButtonGroupText>
          <Button variant="bare" size="icon-sm" aria-label="増やす">
            <Glyph name="plus" />
          </Button>
        </ButtonGroup>
      </Row>
      <Row>
        <ButtonGroup className="w-[360px]">
          <Input variant="boxed" placeholder="作品名で探す" aria-label="作品名で探す" />
          <Button variant="ink">探す</Button>
        </ButtonGroup>
      </Row>
    </>
  ),
}
