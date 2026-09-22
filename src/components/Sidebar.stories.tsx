import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Glyph, type GlyphName } from '../lib/marks'
import { Cap } from '../stories/layout'
import { Avatar, AvatarFallback } from './Avatar'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
} from './Sidebar'
import { ToggleGroup, ToggleGroupItem } from './ToggleGroup'

const meta: Meta<typeof Sidebar> = { title: '手触り / Sidebar', component: Sidebar }
export default meta
type Story = StoryObj<typeof Sidebar>

const nav: [string, GlyphName, number?][] = [
  ['作業台', 'panel'],
  ['作品', 'file', 24],
  ['窯の記録', 'sun'],
  ['探す', 'search'],
]

function Demo() {
  const [variant, setVariant] = useState<'sidebar' | 'floating' | 'inset'>('sidebar')
  const [collapsible, setCollapsible] = useState<'offcanvas' | 'icon'>('icon')
  const [active, setActive] = useState('作品')
  return (
    <>
      <div className="mb-6 flex flex-wrap gap-4">
        <ToggleGroup
          type="single"
          size="sm"
          variant="contour"
          value={variant}
          onValueChange={(v) => v && setVariant(v as typeof variant)}
          aria-label="型"
        >
          <ToggleGroupItem value="sidebar">端に立てる</ToggleGroupItem>
          <ToggleGroupItem value="floating">浮かべる</ToggleGroupItem>
          <ToggleGroupItem value="inset">本文を沈める</ToggleGroupItem>
        </ToggleGroup>
        <ToggleGroup
          type="single"
          size="sm"
          variant="contour"
          value={collapsible}
          onValueChange={(v) => v && setCollapsible(v as typeof collapsible)}
          aria-label="畳み方"
        >
          <ToggleGroupItem value="icon">印を残す</ToggleGroupItem>
          <ToggleGroupItem value="offcanvas">外へ出す</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {/* transform を持つ枠の中では、fixed の脇の帳もこの枠に収まる */}
      <div
        className="relative mb-14 h-[520px] overflow-hidden rounded-md"
        style={{ transform: 'translateZ(0)' }}
      >
        <SidebarProvider className="min-h-full">
          <Sidebar variant={variant} collapsible={collapsible}>
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" tooltip="土と火">
                    <Avatar size="sm">
                      <AvatarFallback>土</AvatarFallback>
                    </Avatar>
                    <span>土と火</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>工 房</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {nav.map(([t, g, n]) => (
                      <SidebarMenuItem key={t}>
                        <SidebarMenuButton
                          isActive={active === t}
                          tooltip={t}
                          onClick={() => setActive(t)}
                        >
                          <Glyph name={g} />
                          <span>{t}</span>
                        </SidebarMenuButton>
                        {n && <SidebarMenuBadge>{n}</SidebarMenuBadge>}
                        {t === '作品' && (
                          <SidebarMenuSub>
                            {['器', '花入', '茶道具'].map((s) => (
                              <SidebarMenuSubItem key={s}>
                                <SidebarMenuSubButton href="#s">{s}</SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        )}
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton tooltip="設定">
                    <Glyph name="more" />
                    <span>設定</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>
          <SidebarInset>
            <header className="flex items-center gap-3 px-5 py-4">
              <SidebarTrigger />
              <span className="text-[14px] tracking-[.08em]">{active}</span>
            </header>
            <p className="m-0 px-6 text-[13.5px] leading-[1.9] tracking-[.04em] text-tz-ink-2">
              ⌘B（Ctrl+B）でも開け閉めできます。畳むと言葉は引っこみ、印だけが残ります。
            </p>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </>
  )
}

export const Playground: Story = {
  name: '脇の帳',
  render: () => (
    <>
      <Cap>脇 の 帳 — 見 え る の は 内 側 の 一 辺 の 耳 だ け</Cap>
      <Demo />
    </>
  ),
}
