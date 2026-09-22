import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import type { DateRange } from 'react-day-picker'
import { Cap, Fields } from '../stories/layout'
import { Calendar } from './Calendar'
import { Card } from './Card'
import { DatePicker, DateRangePicker } from './DatePicker'
import { Field, FieldLabel, FieldNote } from './Field'

const meta: Meta<typeof Calendar> = { title: '手触り / Calendar', component: Calendar }
export default meta
type Story = StoryObj<typeof Calendar>

const today = new Date()
const at = (d: number) => new Date(today.getFullYear(), today.getMonth(), d)

function Single() {
  const [d, setD] = useState<Date | undefined>(at(18))
  return <Calendar mode="single" selected={d} onSelect={setD} />
}

function Range() {
  const [r, setR] = useState<DateRange | undefined>({ from: at(8), to: at(12) })
  return <Calendar mode="range" selected={r} onSelect={setR} disabled={{ dayOfWeek: [0] }} />
}

export const Playground: Story = {
  name: '暦',
  render: () => (
    <>
      <Cap>暦 — 選 ん だ 日 に 、 手 で 丸 を 付 け る 。 今 日 に は 小 さ な 墨 の 点</Cap>
      <div className="mb-14 flex flex-wrap gap-10">
        <Card variant="inlay" className="w-fit">
          <Single />
        </Card>
        <Card variant="inlay" className="w-fit">
          <Range />
        </Card>
      </div>
    </>
  ),
}

export const Picker: Story = {
  name: '日を選ぶ',
  render: () => (
    <>
      <Cap>日 を 選 ぶ — 選 ん だ 日 付 は 、 罫 に 墨 と し て 写 る</Cap>
      <Fields>
        <Field>
          <FieldLabel asSpan id="dp-1">
            窯 入 れ
          </FieldLabel>
          <DatePicker aria-labelledby="dp-1" />
          <FieldNote>日曜は窯を焚きません</FieldNote>
        </Field>
        <Field>
          <FieldLabel asSpan id="dp-2">
            展 示 の 期 間
          </FieldLabel>
          <DateRangePicker aria-labelledby="dp-2" defaultValue={{ from: at(3), to: at(9) }} />
        </Field>
      </Fields>
    </>
  ),
}
