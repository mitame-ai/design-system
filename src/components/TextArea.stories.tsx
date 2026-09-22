import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap, Fields, Reseed } from '../stories/layout'
import { Field, FieldLabel, FieldNote } from './Field'
import { TextArea } from './TextArea'

const meta = {
  title: '手触り / TextArea',
  component: TextArea,
  argTypes: {
    rows: { control: { type: 'number', min: 2, max: 12 } },
    disabled: { control: 'boolean' },
  },
  args: { rows: 4, placeholder: '轆轤の癖、土の産地、次の窯への覚え書き' },
} satisfies Meta<typeof TextArea>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {
  name: '試す',
  render: (args) => (
    <Fields wide>
      <Field>
        <FieldLabel htmlFor="p-memo">申 し 送 り</FieldLabel>
        <TextArea id="p-memo" {...args} />
      </Field>
    </Fields>
  ),
}

export const Manuscript: Story = {
  name: '原稿用紙',
  render: () => (
    <>
      <Cap>原 稿 用 紙 — 面の中に行が引かれている</Cap>
      <Fields wide>
        <Field>
          <FieldLabel htmlFor="f-memo">申 し 送 り</FieldLabel>
          <TextArea
            id="f-memo"
            rows={4}
            aria-describedby="n-memo"
            placeholder="轆轤の癖、土の産地、次の窯への覚え書き"
          />
          <FieldNote id="n-memo">行は紙に引かれているので、書いても動かない</FieldNote>
        </Field>
      </Fields>
      <Reseed />
    </>
  ),
}
