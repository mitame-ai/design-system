import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Fields, Reseed } from '../stories/layout'
import { Field, FieldLabel, FieldNote } from './Field'
import { Input } from './Input'

const meta = {
  title: '手触り / Input',
  component: Input,
  argTypes: {
    variant: { control: 'inline-radio', options: ['rule', 'boxed'] },
    disabled: { control: 'boolean' },
  },
  args: { variant: 'rule', placeholder: '山田 太郎' },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: '試す',
  render: (args) => (
    <Fields>
      <Field>
        <FieldLabel htmlFor="p-name">名 前</FieldLabel>
        <Input id="p-name" {...args} />
      </Field>
    </Fields>
  ),
}

export const Writing: Story = {
  name: '記入',
  render: () => (
    <>
      <Cap>記 入 — 枠ではなく罫。書いた分だけ墨が染みる</Cap>
      <Fields>
        <Field>
          <FieldLabel htmlFor="f-name" required>
            名 前
          </FieldLabel>
          <Input id="f-name" placeholder="山田 太郎" aria-describedby="n-name" required />
          <FieldNote id="n-name">窯元まで届きます</FieldNote>
        </Field>

        <Field>
          <FieldLabel htmlFor="f-kiln">窯 元</FieldLabel>
          <Input id="f-kiln" defaultValue="丹波 立杭" aria-describedby="n-kiln" />
          <FieldNote id="n-kiln">書かれた分だけ、罫が濃くなっています</FieldNote>
        </Field>
      </Fields>
    </>
  ),
}

export const BoxedAndCorrected: Story = {
  name: 'ボックス型とエラー',
  render: () => (
    <>
      <Cap>ボックス型とエラー — 枠が必要なとき、エラー表示のとき</Cap>
      <Fields>
        <Field>
          <FieldLabel htmlFor="f-count">客 数</FieldLabel>
          <Input
            id="f-count"
            variant="boxed"
            inputMode="numeric"
            defaultValue="六"
            aria-describedby="n-count"
          />
          <FieldNote id="n-count">短い記号は、罫線より枠型が読みやすい</FieldNote>
        </Field>

        <Field invalid>
          <FieldLabel htmlFor="f-tel">電 話</FieldLabel>
          <Input id="f-tel" defaultValue="0797-xx" aria-invalid="true" aria-describedby="n-tel" />
          <FieldNote id="n-tel">桁が足りません</FieldNote>
        </Field>

        <Field>
          <FieldLabel htmlFor="f-off">窯 番</FieldLabel>
          <Input id="f-off" defaultValue="まだ焼いていない" disabled aria-describedby="n-off" />
          <FieldNote id="n-off">紙がまだ用意されていない</FieldNote>
        </Field>
      </Fields>
    </>
  ),
}

export const Composing: Story = {
  name: '変換中',
  render: () => (
    <>
      <Cap>変 換 中 — IME 変換中は、墨が定まるまで染みが点線で表示される</Cap>
      <Fields>
        <Field>
          <FieldLabel htmlFor="f-ime">産 地</FieldLabel>
          <Input id="f-ime" placeholder="かな入力で打ってみる" aria-describedby="n-ime" />
          <FieldNote id="n-ime">
            日本語入力の変換が確定するまで、罫の墨は点線のまま留まります
          </FieldNote>
        </Field>
      </Fields>
      <Reseed />
    </>
  ),
}
