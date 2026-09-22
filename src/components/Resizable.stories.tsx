import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap } from '../stories/layout'
import { Card } from './Card'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from './Resizable'

const meta: Meta<typeof ResizablePanelGroup> = {
  title: '手触り / Resizable',
  component: ResizablePanelGroup,
}
export default meta
type Story = StoryObj<typeof ResizablePanelGroup>

const Pane = ({ children }: { children: string }) => (
  <div className="flex h-full items-center justify-center text-[13px] tracking-[.1em] text-tz-ink-2">
    {children}
  </div>
)

export const Playground: Story = {
  name: '仕切り',
  render: () => (
    <>
      <Cap>仕 切 り — 区 画 の あ い だ の 罫 を 、 手 で ず ら す</Cap>
      <Card variant="inlay" className="mb-14 h-[300px] max-w-[620px] p-2">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="30%">
            <Pane>棚</Pane>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="70%">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="60%">
                <Pane>作業台</Pane>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize="40%">
                <Pane>記録</Pane>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Card>
    </>
  ),
}
