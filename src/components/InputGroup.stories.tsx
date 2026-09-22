import type { Meta, StoryObj } from '@storybook/react-vite'
import { Glyph } from '../lib/marks'
import { Cap, Fields } from '../stories/layout'
import { Field, FieldLabel, FieldNote } from './Field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from './InputGroup'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from './InputOTP'
import { Kbd } from './Kbd'
import { NativeSelect, NativeSelectOptGroup, NativeSelectOption } from './NativeSelect'

const meta: Meta<typeof InputGroup> = { title: '手触り / InputGroup', component: InputGroup }
export default meta
type Story = StoryObj<typeof InputGroup>

export const Playground: Story = {
  name: '添え書きのある入力欄',
  render: () => (
    <>
      <Cap>輪 郭 は 一 つ 、 添 え 物 は そ の 内 側 に</Cap>
      <Fields>
        <Field>
          <FieldLabel htmlFor="ig-1">作 品 を 探 す</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Glyph name="search" />
            </InputGroupAddon>
            <InputGroupInput id="ig-1" placeholder="名前や土で" />
            <InputGroupAddon align="inline-end">
              <Kbd>⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel htmlFor="ig-2">値</FieldLabel>
          <InputGroup variant="rule">
            <InputGroupAddon>
              <InputGroupText>¥</InputGroupText>
            </InputGroupAddon>
            <InputGroupInput id="ig-2" inputMode="numeric" placeholder="4,800" />
            <InputGroupAddon align="inline-end">
              <InputGroupText>税込</InputGroupText>
            </InputGroupAddon>
          </InputGroup>
          <FieldNote>罫の型でも、添え物は罫の上に並ぶ</FieldNote>
        </Field>
      </Fields>
      <Fields wide>
        <Field>
          <FieldLabel htmlFor="ig-3">便 り</FieldLabel>
          <InputGroup>
            <InputGroupTextarea id="ig-3" placeholder="窯出しの様子を書く" />
            <InputGroupAddon align="block-end">
              <InputGroupButton size="icon-sm" aria-label="写真を添える">
                <Glyph name="clip" />
              </InputGroupButton>
              <InputGroupText className="ml-auto">0 / 400</InputGroupText>
              <InputGroupButton variant="ink">送る</InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </Fields>
    </>
  ),
}

export const Otp: Story = {
  name: '枡の罫',
  render: () => (
    <>
      <Cap>枡 の 罫 — 今 書 く 枡 の 罫 だ け が 引 き 直 さ れ 、 両 端 に か ぎ が 立 つ</Cap>
      <div className="mb-14">
        <InputOTP maxLength={6} aria-label="確かめの番号">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>
    </>
  ),
}

export const Native: Story = {
  name: '素のセレクト',
  render: () => (
    <>
      <Cap>素 の セ レ ク ト — 一 覧 は O S の も の 。 選 ん だ 言 葉 は 罫 に 写 る</Cap>
      <Fields>
        <Field>
          <FieldLabel htmlFor="ns-1">土</FieldLabel>
          <NativeSelect id="ns-1" defaultValue="">
            <NativeSelectOption value="" disabled>
              まだ決めていない
            </NativeSelectOption>
            <NativeSelectOptGroup label="近畿">
              <NativeSelectOption value="信楽">信楽</NativeSelectOption>
              <NativeSelectOption value="丹波">丹波</NativeSelectOption>
            </NativeSelectOptGroup>
            <NativeSelectOptGroup label="中国">
              <NativeSelectOption value="備前">備前</NativeSelectOption>
            </NativeSelectOptGroup>
          </NativeSelect>
        </Field>
        <Field>
          <FieldLabel htmlFor="ns-2">数</FieldLabel>
          <NativeSelect id="ns-2" variant="boxed" defaultValue="3">
            {[1, 2, 3, 4, 5].map((n) => (
              <NativeSelectOption key={n} value={n}>
                {n} 点
              </NativeSelectOption>
            ))}
          </NativeSelect>
        </Field>
      </Fields>
    </>
  ),
}
