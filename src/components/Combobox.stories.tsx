import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Cap, Fields } from '../stories/layout'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
} from './Combobox'
import { Field, FieldLabel, FieldNote } from './Field'

const meta: Meta<typeof Combobox> = { title: '手触り / Combobox', component: Combobox }
export default meta
type Story = StoryObj<typeof Combobox>

const 産地 = {
  近畿: ['信楽', '丹波', '伊賀'],
  中国: ['備前', '萩'],
  九州: ['唐津', '有田', '小石原', '小鹿田'],
}

function Pick() {
  const [v, setV] = useState<string | undefined>('備前')
  return (
    <Field>
      <FieldLabel htmlFor="cb-soil">産 地</FieldLabel>
      <Combobox value={v} onValueChange={setV}>
        <ComboboxInput id="cb-soil" placeholder="書いて探す" />
        <ComboboxContent>
          <ComboboxEmpty>当てはまる産地がありません</ComboboxEmpty>
          {Object.entries(産地).map(([region, list]) => (
            <ComboboxGroup key={region} heading={region}>
              {list.map((t) => (
                <ComboboxItem key={t} value={t}>
                  {t}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          ))}
        </ComboboxContent>
      </Combobox>
      <FieldNote>選んだ産地 : {v ?? 'まだ決めていない'}</FieldNote>
    </Field>
  )
}

export const Playground: Story = {
  name: '書いて選ぶ',
  render: () => (
    <>
      <Cap>書 い て 選 ぶ — 書 い た 言 葉 に 合 う 候 補 だ け が 紙 に 残 る</Cap>
      <Fields>
        <Pick />
      </Fields>
    </>
  ),
}
