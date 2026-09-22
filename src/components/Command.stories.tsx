import type { Meta, StoryObj } from '@storybook/react-vite'
import { useEffect, useState } from 'react'
import { Glyph } from '../lib/marks'
import { Cap, Row } from '../stories/layout'
import { Button } from './Button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from './Command'
import { Kbd } from './Kbd'

const meta: Meta<typeof Command> = { title: '手触り / Command', component: Command }
export default meta
type Story = StoryObj<typeof Command>

const Body = () => (
  <>
    <CommandInput placeholder="探したい言葉を書く" />
    <CommandList>
      <CommandEmpty>当てはまるものがありません</CommandEmpty>
      <CommandGroup heading="よく使う">
        <CommandItem>
          <Glyph name="file" /> 新しい記録
          <CommandShortcut>⌘N</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <Glyph name="search" /> 作品を探す
        </CommandItem>
        <CommandItem disabled>
          <Glyph name="clip" /> 写真を添える
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="窯">
        <CommandItem>温度の記録</CommandItem>
        <CommandItem>窯詰めの図</CommandItem>
        <CommandItem>窯出しの予定</CommandItem>
      </CommandGroup>
    </CommandList>
  </>
)

function Palette() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((o) => !o)
      }
    }
    window.addEventListener('keydown', on)
    return () => window.removeEventListener('keydown', on)
  }, [])
  return (
    <>
      <Button variant="contour" onClick={() => setOpen(true)}>
        索引を開く <Kbd>⌘K</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Body />
      </CommandDialog>
    </>
  )
}

export const Playground: Story = {
  name: '索引',
  render: () => (
    <>
      <Cap>索 引 — 書 き 入 れ た 言 葉 に 合 う 項 目 だ け が 残 る</Cap>
      <div className="mb-14 max-w-[420px]">
        <Command>
          <Body />
        </Command>
      </div>
      <Cap>差 し 出 す 索 引</Cap>
      <Row>
        <Palette />
      </Row>
    </>
  ),
}
