import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Reseed, Row } from '../stories/layout'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from './Avatar'

const meta: Meta<typeof Avatar> = { title: '手触り / Avatar', component: Avatar }
export default meta
type Story = StoryObj<typeof Avatar>

const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#b9ab98"/><circle cx="20" cy="16" r="7" fill="#7d6f60"/><ellipse cx="20" cy="36" rx="13" ry="10" fill="#7d6f60"/></svg>',
  )

export const Playground: Story = {
  name: '顔',
  render: () => (
    <>
      <Cap>顔 — 線 は 写 真 の 上 に 引 く</Cap>
      <Row>
        <Avatar size="sm">
          <AvatarFallback>土</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src={photo} alt="" />
          <AvatarFallback>陶</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>窯</AvatarFallback>
        </Avatar>
      </Row>
      <Cap>重 ね る — 後 ろ の 顔 と の 間 に 紙 の 余 白 を 残 す</Cap>
      <Row>
        <AvatarGroup>
          {['一', '二', '三'].map((t) => (
            <Avatar key={t}>
              <AvatarFallback>{t}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
      </Row>
      <Reseed />
    </>
  ),
}
