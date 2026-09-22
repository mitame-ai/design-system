import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Row } from '../stories/layout'
import { Button } from './Button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './Drawer'
import { Field, FieldLabel } from './Field'
import { Input } from './Input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './Sheet'
import { Slider } from './Slider'

const meta: Meta<typeof Sheet> = { title: '手触り / Sheet', component: Sheet }
export default meta
type Story = StoryObj<typeof Sheet>

export const Playground: Story = {
  name: '差し込み紙・引き出し',
  render: () => (
    <>
      <Cap>差 し 込 み 紙 — 見 え る の は 、 手 漉 き の 耳 が 残 っ た 一 辺 だ け</Cap>
      <Row>
        {(['right', 'left', 'bottom'] as const).map((side) => (
          <Sheet key={side}>
            <SheetTrigger asChild>
              <Button variant="contour" size="sm">
                {{ right: '右から', left: '左から', bottom: '下から' }[side]}
              </Button>
            </SheetTrigger>
            <SheetContent side={side}>
              <SheetHeader>
                <SheetTitle>作品の情報</SheetTitle>
                <SheetDescription>名前と値を書き換えられます。</SheetDescription>
              </SheetHeader>
              <Field>
                <FieldLabel htmlFor={`s-${side}`}>名 前</FieldLabel>
                <Input id={`s-${side}`} defaultValue="粉引の湯呑" />
              </Field>
              <SheetFooter>
                <SheetClose asChild>
                  <Button>保存する</Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        ))}
      </Row>
      <Cap>
        引 き 出 し — 下 へ 払 え ば 戻 っ て い く 。 払 い が 足 り な け れ ば 揺 れ 戻 る
      </Cap>
      <Row>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="contour">温度を決める</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>本焼きの温度</DrawerTitle>
              <DrawerDescription>釉薬に合わせて決めてください。</DrawerDescription>
            </DrawerHeader>
            <div className="px-2 py-4">
              <Slider defaultValue={[1230]} min={1100} max={1300} step={10} aria-label="温度" />
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>決める</Button>
              </DrawerClose>
              <DrawerClose asChild>
                <Button variant="bare">やめる</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </Row>
    </>
  ),
}
