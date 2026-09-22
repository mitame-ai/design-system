import type { Meta, StoryObj } from '@storybook/react-vite'
import { Glyph } from '../lib/marks'
import { Cap } from '../stories/layout'
import { Alert, AlertAction, AlertDescription, AlertTitle } from './Alert'
import { Button } from './Button'

const meta: Meta<typeof Alert> = { title: '手触り / Alert', component: Alert }
export default meta
type Story = StoryObj<typeof Alert>

export const Playground: Story = {
  name: '貼り紙',
  render: () => (
    <>
      <Cap>貼 り 紙 — 読 ん で ほ し い こ と を 、 紙 に 沈 め て 示 す</Cap>
      <div className="mb-14 grid max-w-[560px] gap-6">
        <Alert>
          <Glyph name="info" />
          <AlertTitle>窯入れは明朝 6 時です</AlertTitle>
          <AlertDescription>
            前日の 18 時までに、素焼きを済ませた器を棚に並べてください。
          </AlertDescription>
        </Alert>
        <Alert variant="shu">
          <Glyph name="alert" />
          <AlertTitle>釉薬の在庫が足りません</AlertTitle>
          <AlertDescription>
            <p>朱の貼り紙は、面も枠も塗らない。左に朱の傍線を一本引く。</p>
          </AlertDescription>
        </Alert>
        <Alert>
          <AlertTitle>下書きを保存しました</AlertTitle>
          <AlertDescription>ほかの端末からも続きを書けます。</AlertDescription>
          <AlertAction>
            <Button variant="bare" size="sm">
              開く
            </Button>
          </AlertAction>
        </Alert>
      </div>
    </>
  ),
}
