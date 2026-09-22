import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap } from '../stories/layout'
import { Button } from './Button'
import { Checkbox } from './Checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from './Field'
import { Input } from './Input'
import { Switch } from './Switch'

const meta: Meta<typeof Field> = { title: '手触り / Field', component: Field }
export default meta
type Story = StoryObj<typeof Field>

export const Playground: Story = {
  name: '束ね',
  render: () => (
    <>
      <Cap>束 ね — ラ ベ ル 、 書 く 場 所 、 注 記 を ひ と ま と め に す る</Cap>
      <form className="mb-14 max-w-[520px]" onSubmit={(e) => e.preventDefault()}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend>窯の予約</FieldLegend>
            <FieldDescription>窯入れの前日までに書いてください。</FieldDescription>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="f-name" required>
                  名 前
                </FieldLabel>
                <Input id="f-name" placeholder="山田 太郎" />
              </Field>
              <Field invalid>
                <FieldLabel htmlFor="f-count">点 数</FieldLabel>
                <Input id="f-count" defaultValue="52" aria-invalid />
                <FieldError errors={[{ message: '一度に焼けるのは 40 点までです' }]} />
              </Field>
            </FieldGroup>
          </FieldSet>
          <FieldSeparator>または</FieldSeparator>
          <FieldSet>
            <FieldLegend variant="label">知 ら せ</FieldLegend>
            <Field orientation="horizontal">
              <Checkbox id="f-mail" defaultChecked />
              <FieldContent>
                <FieldLabel htmlFor="f-mail">窯出しを知らせる</FieldLabel>
                <FieldDescription>窯を開けたら、手紙でお知らせします。</FieldDescription>
              </FieldContent>
            </Field>
            <Field orientation="horizontal">
              <FieldContent>
                <FieldTitle>写真を添える</FieldTitle>
                <FieldDescription>窯出しの写真を一枚添えます。</FieldDescription>
              </FieldContent>
              <Switch aria-label="写真を添える" />
            </Field>
          </FieldSet>
          <Field orientation="horizontal">
            <Button type="submit">予約する</Button>
            <Button variant="bare">やめる</Button>
          </Field>
        </FieldGroup>
      </form>
    </>
  ),
}
