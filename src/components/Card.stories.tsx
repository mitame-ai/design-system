import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Cards, Reseed } from '../stories/layout'
import { Button } from './Button'
import { Card, CardFooter, CardMedia, CardMeta, CardText, CardTitle } from './Card'
import { Icon } from './Icon'
import { Rule } from './Rule'

const meta = {
  title: '手触り / Card',
  component: Card,
  argTypes: {
    variant: { control: 'inline-radio', options: ['plain', 'pick', 'inlay'] },
  },
  args: { variant: 'plain' },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: '試す',
  render: (args) => (
    <Cards>
      <Card {...args}>
        <CardTitle>粉引の湯呑</CardTitle>
        <CardText>同じ土、同じ窯。それでも一客ずつ縁の厚みが違う。</CardText>
      </Card>
    </Cards>
  ),
}

export const Sheets: Story = {
  name: '札',
  render: () => (
    <>
      <Cap>札 — 影も耳も、その一枚のかたちを持つ</Cap>
      <Cards>
        <Card>
          <CardMedia />
          <CardTitle>粉引の湯呑</CardTitle>
          <CardText>
            同じ土、同じ窯。それでも一客ずつ縁の厚みが違う。
            <br />
            持つ手の側が、少しだけ薄い。
          </CardText>
          <CardFooter>
            <CardMeta>窯 出 し 三 日 目</CardMeta>
            <Button variant="bare" size="sm">
              見る
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardTitle>手の記録</CardTitle>
          <CardText>轆轤の速さ、指の圧、土の水分。数値にならないものが形に残る。</CardText>
          <Rule />
          <CardMeta>四 代 目 / 窯 番 十 七</CardMeta>
          <CardFooter>
            <CardMeta>未 完</CardMeta>
            <Button variant="contour" size="sm">
              続ける
            </Button>
          </CardFooter>
        </Card>

        <Card variant="inlay">
          <CardTitle>象嵌の札</CardTitle>
          <CardText>
            浮かない面。影を持たず、紙に沈んで区切るだけ。触れられないものは、応えない。
          </CardText>
          <CardFooter>
            <CardMeta>非 対 話</CardMeta>
          </CardFooter>
        </Card>
      </Cards>
    </>
  ),
}

export const PickedUp: Story = {
  name: '拾い上げる',
  render: () => (
    <>
      <Cap>拾 い 上 げ る — 手が近づいた角が起きる</Cap>
      <Cards min={300}>
        <Card variant="pick" asChild>
          <a href="#kiln">
            <CardTitle>
              この一客を選ぶ
              <Icon>
                <path d="M2.4 8 H13.2 M8.6 3.6 L13.3 8 L8.6 12.4" />
              </Icon>
            </CardTitle>
            <CardText>
              角に手を近づけると、その角だけが持ち上がる。押せば紙は机に押しつけられ、影が縮む。
            </CardText>
            <CardFooter>
              <CardMeta>四 隅 を 試 す</CardMeta>
            </CardFooter>
          </a>
        </Card>
        <Card variant="pick" asChild>
          <a href="#kiln">
            <CardTitle>
              もう一客
              <Icon>
                <path d="M2.4 8 H13.2 M8.6 3.6 L13.3 8 L8.6 12.4" />
              </Icon>
            </CardTitle>
            <CardText>同じ指定の札。耳の破れかたも、影のかたちも、揺れる周期も違う。</CardText>
            <CardFooter>
              <CardMeta>別 の 個 体</CardMeta>
            </CardFooter>
          </a>
        </Card>
      </Cards>
      <Reseed />
    </>
  ),
}
