import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Reseed, Row } from '../stories/layout'
import { Badge } from './Badge'

const meta: Meta<typeof Badge> = { title: '手触り / Badge', component: Badge }
export default meta
type Story = StoryObj<typeof Badge>

export const Playground: Story = {
  name: '札',
  render: () => (
    <>
      <Cap>札 — 塗 り ・ 輪 郭 ・ 象 嵌 ・ 朱</Cap>
      <Row>
        <Badge>窯出し</Badge>
        <Badge variant="contour">信楽</Badge>
        <Badge variant="inlay">在庫 3</Badge>
        <Badge variant="shu">要確認</Badge>
        <Badge variant="contour" asChild>
          <a href="#badge">リンクの札</a>
        </Badge>
      </Row>
      <Reseed />
    </>
  ),
}
