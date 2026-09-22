import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Reseed, Row } from '../stories/layout'
import { Button } from './Button'
import { Icon } from './Icon'

const meta = {
  title: '手触り / Button',
  component: Button,
  argTypes: {
    variant: { control: 'inline-radio', options: ['ink', 'contour', 'bare'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'icon'] },
    loading: { control: 'boolean' },
    disabled: { control: 'boolean' },
  },
  args: { variant: 'ink', size: 'md', children: '仕立てる' },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = { name: '試す' }

export const Variants: Story = {
  name: '三態',
  render: () => (
    <>
      <Cap>三 態</Cap>
      <Row>
        <Button variant="ink">仕立てる</Button>
        <Button variant="contour">下ごしらえ</Button>
        <Button variant="bare">やめておく</Button>
      </Row>
    </>
  ),
}

export const Sizes: Story = {
  name: '大きさ',
  render: () => (
    <>
      <Cap>大 き さ</Cap>
      <Row>
        <Button variant="contour" size="sm">
          小
        </Button>
        <Button variant="contour">中</Button>
        <Button variant="contour" size="lg">
          大
        </Button>
        <Button variant="contour" size="icon" aria-label="足す">
          <Icon>
            <path d="M8 2.6 V13.4 M2.6 8 H13.4" />
          </Icon>
        </Button>
        <Button variant="ink" size="icon" aria-label="送る">
          <Icon>
            <path d="M2.4 8 H13.2 M8.6 3.6 L13.3 8 L8.6 12.4" />
          </Icon>
        </Button>
      </Row>
    </>
  ),
}

export const Individuals: Story = {
  name: '個体差',
  render: () => (
    <>
      <Cap>個 体 差 — 同じ指定、同じ輪郭にはならない</Cap>
      <Row>
        <Button variant="contour">湯呑</Button>
        <Button variant="contour">湯呑</Button>
        <Button variant="contour">湯呑</Button>
        <Button variant="contour">湯呑</Button>
      </Row>
    </>
  ),
}

export const Dent: Story = {
  name: 'たわみ',
  render: () => (
    <>
      <Cap>た わ み — 端を押すと、その端がへこむ</Cap>
      <Row>
        <Button variant="contour" size="lg">
          端を押してみる
        </Button>
        <Button variant="ink" size="lg">
          中央を押してみる
        </Button>
      </Row>
    </>
  ),
}

export const States: Story = {
  name: '状態',
  render: () => (
    <>
      <Cap>状 態 — 色ではなく、形と拍で示す</Cap>
      <Row>
        <Button variant="ink" loading>
          縫っています
        </Button>
        <Button variant="contour" disabled>
          まだ焼けていない
        </Button>
        <Button variant="bare" disabled>
          触れられない
        </Button>
      </Row>
    </>
  ),
}

export const Reseeding: Story = {
  name: '形状の再生成',
  render: () => (
    <>
      <Cap>個 体 差 — シードを更新すると、すべての形状が新しく生成される</Cap>
      <Row>
        <Button variant="contour">湯呑</Button>
        <Button variant="contour">湯呑</Button>
        <Button variant="contour">湯呑</Button>
      </Row>
      <Reseed />
    </>
  ),
}
