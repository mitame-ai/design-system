import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Row } from '../stories/layout'
import { Avatar, AvatarFallback } from './Avatar'
import { Button } from './Button'
import { Field, FieldLabel } from './Field'
import { HoverCard, HoverCardContent, HoverCardTrigger } from './HoverCard'
import { Input } from './Input'
import { Kbd } from './Kbd'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from './Popover'
import { Tooltip, TooltipContent, TooltipTrigger } from './Tooltip'

const meta: Meta<typeof Popover> = { title: '手触り / Popover', component: Popover }
export default meta
type Story = StoryObj<typeof Popover>

export const Playground: Story = {
  name: '浮き紙・添え書き・覗き紙',
  render: () => (
    <>
      <Cap>浮 き 紙 — 押 し た 場 所 の そ ば に 、 一 枚 の 紙 が そ っ と 置 か れ る</Cap>
      <Row>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="contour">寸法を変える</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>寸法</PopoverTitle>
              <PopoverDescription>器の口径と高さを決めます。</PopoverDescription>
            </PopoverHeader>
            <div className="grid gap-4">
              <Field>
                <FieldLabel htmlFor="p-w">口 径</FieldLabel>
                <Input id="p-w" defaultValue="8.5 cm" />
              </Field>
              <Field>
                <FieldLabel htmlFor="p-h">高 さ</FieldLabel>
                <Input id="p-h" defaultValue="9 cm" />
              </Field>
            </div>
          </PopoverContent>
        </Popover>
      </Row>
      <Cap>添 え 書 き — 墨 で 塗 っ た 小 さ な 札 に 、 白 抜 き で 一 言</Cap>
      <Row>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="bare">手を留める</Button>
          </TooltipTrigger>
          <TooltipContent>
            下書きを保存 <Kbd>⌘S</Kbd>
          </TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="contour" size="sm">
              上に出す
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top">上に置かれた札</TooltipContent>
        </Tooltip>
      </Row>
      <Cap>覗 き 紙 — リ ン ク に 手 を 留 め る と 、 そ の 先 の 様 子 を 写 し て 見 せ る</Cap>
      <Row>
        <HoverCard>
          <HoverCardTrigger asChild>
            <a
              href="#hc"
              className="text-[14px] tracking-[.05em] text-tz-ink underline underline-offset-4"
            >
              @土と火
            </a>
          </HoverCardTrigger>
          <HoverCardContent>
            <div className="flex gap-3.5">
              <Avatar>
                <AvatarFallback>土</AvatarFallback>
              </Avatar>
              <div>
                <p className="m-0 text-[14px] font-semibold tracking-[.06em]">土と火</p>
                <p className="m-0 mt-1 text-[12.5px] text-tz-ink-2">
                  信楽の小さな工房。粉引と焼締を中心に。
                </p>
                <p className="m-0 mt-2 text-[11px] tracking-[.12em] text-tz-ink-3">2019 年から</p>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </Row>
    </>
  ),
}
