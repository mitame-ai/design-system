import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Row } from '../stories/layout'
import { Button } from './Button'
import { Toaster, toast } from './Toast'

const meta: Meta<typeof Toaster> = { title: '手触り / Toast', component: Toaster }
export default meta
type Story = StoryObj<typeof Toaster>

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const Playground: Story = {
  name: '知らせ',
  render: () => (
    <>
      <Cap>
        知 ら せ — 隅 に 一 枚 ず つ 差 し 込 ま れ 、 重 な っ て い く 。 手 を 留 め る と ほ ど
        け る
      </Cap>
      <Row>
        <Button
          variant="contour"
          onClick={() => toast('下書きを保存しました', { description: '9 月 23 日 14:02' })}
        >
          知らせる
        </Button>
        <Button variant="contour" onClick={() => toast.success('窯出しを記録しました')}>
          済んだ
        </Button>
        <Button
          variant="contour"
          onClick={() =>
            toast.error('写真を送れませんでした', {
              description: '通信が途切れました。もう一度お試しください。',
              action: { label: '再送', onClick: () => toast('送り直しています') },
            })
          }
        >
          失敗
        </Button>
        <Button
          variant="contour"
          onClick={() =>
            toast.promise(wait(2200), {
              loading: '窯の記録を送っています',
              success: '送りました',
              error: '失敗しました',
            })
          }
        >
          待つ
        </Button>
      </Row>
      <Toaster />
    </>
  ),
}
