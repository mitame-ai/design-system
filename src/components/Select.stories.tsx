import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Cap, Fields, Reseed } from '../stories/layout'
import { Field, FieldLabel, FieldNote } from './Field'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from './Select'

const meta = {
  title: '手触り / Select',
  component: Select,
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

const 土 = ['信楽', '丹波', '備前', '唐津', '萩']

export const Playground: Story = {
  name: '試す',
  render: () => (
    <Fields>
      <Field>
        <FieldLabel asSpan id="p-soil">
          土
        </FieldLabel>
        <Select defaultValue="信楽">
          <SelectTrigger aria-labelledby="p-soil">
            <SelectValue placeholder="まだ決めていない" />
          </SelectTrigger>
          <SelectContent aria-labelledby="p-soil">
            {土.map((t) => (
              <SelectItem key={t} value={t} disabled={t === '唐津'}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
    </Fields>
  ),
}

export const Picking: Story = {
  name: '選ぶ',
  render: () => (
    <>
      <Cap>選 ぶ — 閉じていても、下に選択肢が重なっている</Cap>
      <Fields>
        <Field>
          <FieldLabel asSpan id="l-soil">
            土
          </FieldLabel>
          <Select defaultValue="信楽">
            <SelectTrigger aria-labelledby="l-soil" aria-describedby="n-soil">
              <SelectValue placeholder="まだ決めていない" />
            </SelectTrigger>
            <SelectContent aria-labelledby="l-soil">
              <SelectItem value="信楽">信楽</SelectItem>
              <SelectItem value="丹波">丹波</SelectItem>
              <SelectItem value="備前">備前</SelectItem>
              <SelectItem value="唐津" disabled>
                唐津
              </SelectItem>
              <SelectItem value="萩">萩</SelectItem>
            </SelectContent>
          </Select>
          <FieldNote id="n-soil">選んだ言葉は、そのまま罫の墨になります</FieldNote>
        </Field>

        <Field>
          <FieldLabel asSpan id="l-fire">
            焼 成
          </FieldLabel>
          <Select>
            <SelectTrigger aria-labelledby="l-fire" aria-describedby="n-fire">
              <SelectValue placeholder="まだ決めていない" />
            </SelectTrigger>
            <SelectContent aria-labelledby="l-fire">
              <SelectItem value="酸化">酸化</SelectItem>
              <SelectItem value="還元">還元</SelectItem>
              <SelectItem value="焼締">焼締</SelectItem>
            </SelectContent>
          </Select>
          <FieldNote id="n-fire">未選択の項目には、まだ墨が乗っていない</FieldNote>
        </Field>
      </Fields>
    </>
  ),
}

export const Controlled: Story = {
  name: '値を外から持つ',
  render: function Controlled() {
    const [v, setV] = useState('丹波')
    return (
      <>
        <Cap>写 す — 選んだ言葉の幅が、そのまま罫の墨になる</Cap>
        <Fields>
          <Field>
            <FieldLabel asSpan id="c-soil">
              土
            </FieldLabel>
            <Select value={v} onValueChange={setV}>
              <SelectTrigger aria-labelledby="c-soil" aria-describedby="c-note">
                <SelectValue placeholder="まだ決めていない" />
              </SelectTrigger>
              <SelectContent aria-labelledby="c-soil">
                {土.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldNote id="c-note">いま選ばれているのは「{v}」です</FieldNote>
          </Field>
        </Fields>
      </>
    )
  },
}

export const OpeningUpward: Story = {
  name: '上向きに開く',
  render: () => (
    <>
      <Cap>展 開 方 向 — 下部に余白がない場合、ドロップダウンは上方へ展開される</Cap>
      <div className="h-[62vh]" />
      <Fields>
        <Field>
          <FieldLabel asSpan id="u-soil">
            土
          </FieldLabel>
          <Select defaultValue="備前">
            <SelectTrigger aria-labelledby="u-soil">
              <SelectValue placeholder="まだ決めていない" />
            </SelectTrigger>
            <SelectContent aria-labelledby="u-soil">
              {土.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
      </Fields>
      <Reseed />
    </>
  ),
}

export const Grouped: Story = {
  name: '組に分ける',
  render: () => (
    <>
      <Cap>組 — 選 択 肢 を 産 地 ご と に ま と め る</Cap>
      <Fields>
        <Field>
          <FieldLabel asSpan id="g-soil">
            産 地
          </FieldLabel>
          <Select>
            <SelectTrigger aria-labelledby="g-soil">
              <SelectValue placeholder="まだ決めていない" />
            </SelectTrigger>
            <SelectContent aria-labelledby="g-soil">
              <SelectGroup>
                <SelectLabel>近 畿</SelectLabel>
                <SelectItem value="信楽">信楽</SelectItem>
                <SelectItem value="丹波">丹波</SelectItem>
              </SelectGroup>
              <SelectSeparator />
              <SelectGroup>
                <SelectLabel>九 州</SelectLabel>
                <SelectItem value="唐津">唐津</SelectItem>
                <SelectItem value="有田">有田</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </Fields>
    </>
  ),
}
