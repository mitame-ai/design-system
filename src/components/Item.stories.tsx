import type { Meta, StoryObj } from '@storybook/react-vite'
import { Glyph } from '../lib/marks'
import { Cap } from '../stories/layout'
import { Avatar, AvatarFallback } from './Avatar'
import { Badge } from './Badge'
import { Button } from './Button'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from './Item'

const meta: Meta<typeof Item> = { title: '手触り / Item', component: Item }
export default meta
type Story = StoryObj<typeof Item>

export const Playground: Story = {
  name: '項目',
  render: () => (
    <>
      <Cap>素 ・ 輪 郭 ・ 象 嵌</Cap>
      <div className="mb-14 grid max-w-[560px] gap-5">
        <Item>
          <ItemContent>
            <ItemTitle>素の項目</ItemTitle>
            <ItemDescription>面を持たない。行を区切るのは罫だけ。</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="contour" size="sm">
              開く
            </Button>
          </ItemActions>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <Glyph name="file" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              焼成記録 <Badge variant="inlay">3 件</Badge>
            </ItemTitle>
            <ItemDescription>薄い紙の枠。中に小さな象嵌の枡を置ける。</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="muted" asChild>
          <a href="#item">
            <ItemMedia>
              <Avatar size="sm">
                <AvatarFallback>佐</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>リンクの項目（象嵌）</ItemTitle>
              <ItemDescription>触れる項目だけが、押すと紙全体がしなる。</ItemDescription>
            </ItemContent>
            <Glyph name="next" />
          </a>
        </Item>
      </div>
      <Cap>一 覧</Cap>
      <ItemGroup className="mb-14 max-w-[560px]">
        {['信楽', '備前', '丹波'].map((t, i) => (
          <div key={t}>
            {i > 0 && <ItemSeparator />}
            <Item size="sm">
              <ItemContent>
                <ItemTitle>{t}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <span className="text-[12px] text-tz-ink-3">{12 - i * 4} 点</span>
              </ItemActions>
            </Item>
          </div>
        ))}
      </ItemGroup>
    </>
  ),
}
