import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap } from '../stories/layout'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './Tabs'

const meta: Meta<typeof Tabs> = { title: '手触り / Tabs', component: Tabs }
export default meta
type Story = StoryObj<typeof Tabs>

const Body = ({ children }: { children: string }) => (
  <p className="m-0 max-w-[520px] text-[13.5px] leading-[1.9] tracking-[.04em] text-tz-ink-2">
    {children}
  </p>
)

export const Playground: Story = {
  name: '見出し',
  render: () => (
    <>
      <Cap>一 筆 — 選 ば れ た 見 出 し の 下 に 、 そ の 場 で 一 筆 引 く</Cap>
      <Tabs defaultValue="clay" className="mb-14">
        <TabsList aria-label="工程">
          <TabsTrigger value="clay">土練り</TabsTrigger>
          <TabsTrigger value="throw">成形</TabsTrigger>
          <TabsTrigger value="fire">焼成</TabsTrigger>
          <TabsTrigger value="off" disabled>
            検品
          </TabsTrigger>
        </TabsList>
        <TabsContent value="clay">
          <Body>菊練りで土の中の空気を抜く。練りが足りないと、焼成中に器が割れる。</Body>
        </TabsContent>
        <TabsContent value="throw">
          <Body>轆轤の中心に土を据え、両手で挟んで立ち上げる。</Body>
        </TabsContent>
        <TabsContent value="fire">
          <Body>素焼きは 800℃、本焼きは 1230℃ 前後。還元は窯の空気を絞って炎を立たせる。</Body>
        </TabsContent>
      </Tabs>
      <Cap>浮 く 紙 — 沈 め た 溝 の 中 で 、 選 ば れ た 見 出 し だ け が 紙 と し て 浮 く</Cap>
      <Tabs defaultValue="week" className="mb-14">
        <TabsList variant="inlay" aria-label="期間">
          <TabsTrigger value="day">日</TabsTrigger>
          <TabsTrigger value="week">週</TabsTrigger>
          <TabsTrigger value="month">月</TabsTrigger>
        </TabsList>
        <TabsContent value="day">
          <Body>今日の窯入れ : 12 点</Body>
        </TabsContent>
        <TabsContent value="week">
          <Body>今週の窯入れ : 58 点</Body>
        </TabsContent>
        <TabsContent value="month">
          <Body>今月の窯入れ : 214 点</Body>
        </TabsContent>
      </Tabs>
    </>
  ),
}
