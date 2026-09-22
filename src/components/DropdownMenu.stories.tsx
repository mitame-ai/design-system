import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Cap, Row } from '../stories/layout'
import { Button } from './Button'
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from './ContextMenu'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './DropdownMenu'
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from './Menubar'

const meta: Meta<typeof DropdownMenu> = { title: '手触り / DropdownMenu', component: DropdownMenu }
export default meta
type Story = StoryObj<typeof DropdownMenu>

function Dropdown() {
  const [grid, setGrid] = useState(true)
  const [fire, setFire] = useState('還元')
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="contour">作品を操作する</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start">
        <DropdownMenuLabel>作 品</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            開く <DropdownMenuShortcut>⌘O</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            写しを作る <DropdownMenuShortcut>⌘D</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>棚へ移す</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>上の棚</DropdownMenuItem>
              <DropdownMenuItem>窯前の棚</DropdownMenuItem>
              <DropdownMenuItem disabled>乾燥棚（満杯）</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem checked={grid} onCheckedChange={setGrid}>
          方眼を見せる
        </DropdownMenuCheckboxItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>焼 成</DropdownMenuLabel>
        <DropdownMenuRadioGroup value={fire} onValueChange={setFire}>
          <DropdownMenuRadioItem value="酸化">酸化</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="還元">還元</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="焼締">焼締</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="shu">
          記録を消す <DropdownMenuShortcut>⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const Playground: Story = {
  name: '札',
  render: () => (
    <>
      <Cap>
        引 き 出 し の 札 — 項 目 は 一 行 ず つ わ ず か に 傾 き 、 定 規 で 揃 え た よ う に は
        並 ば な い
      </Cap>
      <Row>
        <Dropdown />
      </Row>
      <Cap>手 元 の 札 — 右 ク リ ッ ク し た 場 所 に 置 く</Cap>
      <ContextMenu>
        <ContextMenuTrigger className="mb-14 flex h-[140px] max-w-[420px] items-center justify-center rounded-lg border border-dashed border-tz-ink-3 text-[13px] tracking-[.1em] text-tz-ink-3">
          ここを右クリック
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>
            戻る <ContextMenuShortcut>⌘[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            進む <ContextMenuShortcut>⌘]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuCheckboxItem checked>ものさしを見せる</ContextMenuCheckboxItem>
          <ContextMenuItem variant="shu">消す</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
      <Cap>献 立 — 上 に 並 ぶ 見 出 し</Cap>
      <Menubar className="mb-14">
        {['帳面', '編集', '表示'].map((t) => (
          <MenubarMenu key={t}>
            <MenubarTrigger>{t}</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                新しく作る <MenubarShortcut>⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>開く</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>刷る</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        ))}
      </Menubar>
    </>
  ),
}
