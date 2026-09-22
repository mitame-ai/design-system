import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap } from '../stories/layout'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from './NavigationMenu'

const meta: Meta<typeof NavigationMenu> = {
  title: '手触り / NavigationMenu',
  component: NavigationMenu,
}
export default meta
type Story = StoryObj<typeof NavigationMenu>

const Entry = ({ title, children }: { title: string; children: string }) => (
  <li>
    <NavigationMenuLink href="#nav">
      <span className="text-[14px] font-semibold tracking-[.06em]">{title}</span>
      <span className="text-[12.5px] leading-[1.7] tracking-[.04em] text-tz-ink-2">{children}</span>
    </NavigationMenuLink>
  </li>
)

export const Playground: Story = {
  name: '案内',
  render: () => (
    <>
      <Cap>
        案 内 — 見 出 し を 移 る と 、 同 じ 一 枚 の 紙 が そ の 場 で 大 き さ を 変 え る
      </Cap>
      <div className="mb-[260px]">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>工房</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="m-0 grid w-[420px] list-none grid-cols-2 gap-1 p-0">
                  <Entry title="成り立ち">信楽で窯を開いたいきさつ。</Entry>
                  <Entry title="道具">轆轤、鉋、窯の話。</Entry>
                  <Entry title="土">使っている土と、その配合。</Entry>
                  <Entry title="窯">穴窯と電気窯の使い分け。</Entry>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuTrigger>作品</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="m-0 grid w-[260px] list-none gap-1 p-0">
                  <Entry title="器">湯呑、飯碗、鉢。</Entry>
                  <Entry title="花入">一輪挿しから大壺まで。</Entry>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#nav">便り</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  ),
}
