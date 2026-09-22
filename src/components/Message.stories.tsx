import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Glyph } from '../lib/marks'
import { Cap } from '../stories/layout'
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from './Attachment'
import { Avatar, AvatarFallback } from './Avatar'
import { Bubble, BubbleContent, BubbleGroup, BubbleReactions } from './Bubble'
import { Card } from './Card'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from './InputGroup'
import { Marker, MarkerContent } from './Marker'
import { Message, MessageAvatar, MessageContent, MessageFooter, MessageHeader } from './Message'
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerViewport,
} from './MessageScroller'

const meta: Meta<typeof Message> = { title: '手触り / Message', component: Message }
export default meta
type Story = StoryObj<typeof Message>

export const Bubbles: Story = {
  name: '吹き出し',
  render: () => (
    <>
      <Cap>吹 き 出 し — 墨 ・ 紙 ・ 象 嵌 ・ 輪 郭 ・ 素 ・ 朱</Cap>
      <BubbleGroup className="mb-14 max-w-[560px]">
        <Bubble variant="paper">
          <BubbleContent>窯出しはいつ頃になりそうですか。</BubbleContent>
        </Bubble>
        <Bubble align="end">
          <BubbleContent>三日目の朝です。冷ましに二日かかるので。</BubbleContent>
          <BubbleReactions>🙏</BubbleReactions>
        </Bubble>
        <Bubble variant="muted">
          <BubbleContent>象嵌の吹き出し。紙に沈めた面。</BubbleContent>
        </Bubble>
        <Bubble variant="contour" align="end">
          <BubbleContent asChild>
            <button type="button">押せる吹き出し（触れるとたわむ）</button>
          </BubbleContent>
        </Bubble>
        <Bubble variant="ghost">
          <BubbleContent>素の吹き出しは面を持たず、言葉だけが置かれる。</BubbleContent>
        </Bubble>
        <Bubble variant="shu">
          <BubbleContent>送れませんでした。もう一度お試しください。</BubbleContent>
        </Bubble>
      </BubbleGroup>
    </>
  ),
}

export const Attachments: Story = {
  name: '添え物',
  render: () => (
    <>
      <Cap>添 え 物 — 下 書 き ・ 縫 い ・ 乾 き ・ 朱 ・ 済</Cap>
      <AttachmentGroup className="mb-14 max-w-[640px]">
        {(
          [
            ['idle', '窯詰め図.pdf', 'まだ添えていません'],
            ['uploading', '温度記録.csv', '送っています 42%'],
            ['processing', '窯出し.jpg', '整えています'],
            ['error', '動画.mov', '大きすぎて送れません'],
            ['done', '見積書.pdf', '240 KB'],
          ] as const
        ).map(([state, title, desc]) => (
          <Attachment key={title} state={state}>
            <AttachmentMedia>
              <Glyph name={title.endsWith('.jpg') ? 'sun' : 'file'} />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{title}</AttachmentTitle>
              <AttachmentDescription>{desc}</AttachmentDescription>
            </AttachmentContent>
            <AttachmentActions>
              <AttachmentAction aria-label="外す">
                <Glyph name="close" />
              </AttachmentAction>
            </AttachmentActions>
          </Attachment>
        ))}
      </AttachmentGroup>
      <Cap>縦 の 札</Cap>
      <AttachmentGroup className="mb-14">
        {['轆轤.jpg', '釉掛け.jpg', '窯出し.jpg'].map((t) => (
          <Attachment key={t} orientation="vertical" size="sm">
            <AttachmentMedia variant="image">
              <Glyph name="sun" />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{t}</AttachmentTitle>
              <AttachmentDescription>写真</AttachmentDescription>
            </AttachmentContent>
          </Attachment>
        ))}
      </AttachmentGroup>
    </>
  ),
}

type Line = { id: number; me: boolean; text: string }

const seed: Line[] = [
  { id: 1, me: false, text: 'こんにちは。湯呑の注文をしたいのですが。' },
  { id: 2, me: true, text: 'ありがとうございます。土と釉のご希望はありますか。' },
  { id: 3, me: false, text: '信楽の土で、粉引にしてもらえますか。' },
  { id: 4, me: true, text: '承知しました。次の窯は来週の水曜に焚きます。' },
  { id: 5, me: false, text: '窯出しはいつ頃になりそうですか。' },
  { id: 6, me: true, text: '土曜の朝です。冷ましに二日かかります。' },
]

function Chat() {
  const [lines, setLines] = useState(seed)
  const [text, setText] = useState('')
  const send = () => {
    if (!text.trim()) return
    setLines((l) => [...l, { id: l.length + 1, me: true, text }])
    setText('')
    setTimeout(
      () => setLines((l) => [...l, { id: l.length + 1, me: false, text: '楽しみにしています。' }]),
      900,
    )
  }
  return (
    <Card variant="inlay" className="flex h-[440px] max-w-[560px] flex-col gap-3 p-0">
      <MessageScroller className="min-h-0 flex-1">
        <MessageScrollerViewport>
          <MessageScrollerContent>
            <MessageScrollerItem>
              <Marker variant="separator">
                <MarkerContent>9 月 21 日</MarkerContent>
              </Marker>
            </MessageScrollerItem>
            {lines.map((l) => (
              <MessageScrollerItem key={l.id}>
                <Message align={l.me ? 'end' : 'start'}>
                  {!l.me && (
                    <MessageAvatar>
                      <Avatar size="sm">
                        <AvatarFallback>佐</AvatarFallback>
                      </Avatar>
                    </MessageAvatar>
                  )}
                  <MessageContent>
                    {!l.me && <MessageHeader>佐藤</MessageHeader>}
                    <Bubble variant={l.me ? 'ink' : 'paper'}>
                      <BubbleContent>{l.text}</BubbleContent>
                    </Bubble>
                    {l.me && <MessageFooter>既読</MessageFooter>}
                  </MessageContent>
                </Message>
              </MessageScrollerItem>
            ))}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
      <div className="px-4 pb-4">
        <InputGroup>
          <InputGroupInput
            value={text}
            placeholder="返事を書く"
            aria-label="返事を書く"
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.nativeEvent.isComposing) send()
            }}
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="ink" onClick={send}>
              送る
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </div>
    </Card>
  )
}

export const Conversation: Story = {
  name: '会話',
  render: () => (
    <>
      <Cap>
        会 話 — 末 尾 を 読 ん で い る あ い だ は 、 新 し い 発 言 が 来 れ ば 巻 物 が 送 ら れ
        る
      </Cap>
      <div className="mb-14">
        <Chat />
      </div>
    </>
  ),
}
