import type { Meta, StoryObj } from '@storybook/react-vite'
import { Glyph } from '../lib/marks'
import { Cap, Row } from '../stories/layout'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './AlertDialog'
import { Button } from './Button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog'
import { Field, FieldLabel } from './Field'
import { Input } from './Input'

const meta: Meta<typeof Dialog> = { title: '手触り / Dialog', component: Dialog }
export default meta
type Story = StoryObj<typeof Dialog>

export const Playground: Story = {
  name: '差し出す紙',
  render: () => (
    <>
      <Cap>差 し 出 す 紙 — 背 後 は 黒 い 幕 で 覆 わ ず 、 薄 い 紙 を 一 枚 か ぶ せ る</Cap>
      <Row>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="contour">屋号を変える</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>屋号を変える</DialogTitle>
              <DialogDescription>変えた屋号は、次の窯出しの札から使われます。</DialogDescription>
            </DialogHeader>
            <Field>
              <FieldLabel htmlFor="d-name">屋 号</FieldLabel>
              <Input id="d-name" defaultValue="土と火" />
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="bare">やめる</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>保存する</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Row>
      <Cap>確 か め の 紙 — 外 を 押 し て も 閉 じ な い 。 答 え る ま で 置 か れ た ま ま</Cap>
      <Row>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="contour">記録を消す</Button>
          </AlertDialogTrigger>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia>
                <Glyph name="alert" />
              </AlertDialogMedia>
              <AlertDialogTitle>この窯の記録を消しますか</AlertDialogTitle>
              <AlertDialogDescription>
                消した記録は戻せません。温度の推移と写真も一緒に消えます。
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>残す</AlertDialogCancel>
              <AlertDialogAction>消す</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </Row>
    </>
  ),
}
