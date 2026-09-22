import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap } from '../stories/layout'
import { Card, CardMedia, CardMeta, CardText, CardTitle } from './Card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './Carousel'

const meta: Meta<typeof Carousel> = { title: '手触り / Carousel', component: Carousel }
export default meta
type Story = StoryObj<typeof Carousel>

const works = [
  ['粉引の湯呑', '信楽の土に白化粧。'],
  ['焼締の片口', '備前の土を釉を掛けずに。'],
  ['灰釉の小鉢', '丹波の土に木灰の釉。'],
  ['白磁の徳利', '天草の陶石から。'],
  ['織部の皿', '緑の釉と鉄絵。'],
]

export const Playground: Story = {
  name: '繰り',
  render: () => (
    <>
      <Cap>繰 り — 紙 を 一 枚 ず つ 繰 る 。 端 の 紙 の 耳 は 切 り 落 と さ な い</Cap>
      <div className="mx-[64px] mb-14 max-w-[560px]">
        <Carousel opts={{ align: 'start' }}>
          <CarouselContent>
            {works.map(([t, d]) => (
              <CarouselItem key={t} className="basis-1/2">
                <Card>
                  <CardMedia />
                  <CardTitle>{t}</CardTitle>
                  <CardText>{d}</CardText>
                  <CardMeta>2026 · 秋</CardMeta>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>
    </>
  ),
}
