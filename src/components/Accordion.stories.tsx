import type { Meta, StoryObj } from '@storybook/react-vite'
import { Glyph } from '../lib/marks'
import { Cap } from '../stories/layout'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './Accordion'
import { Button } from './Button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './Collapsible'

const meta: Meta<typeof Accordion> = { title: '手触り / Accordion', component: Accordion }
export default meta
type Story = StoryObj<typeof Accordion>

export const Playground: Story = {
  name: '折り',
  render: () => (
    <>
      <Cap>折 り — 畳 ま れ た 紙 を 一 段 ず つ 開 く</Cap>
      <Accordion type="single" collapsible defaultValue="a" className="mb-14 max-w-[560px]">
        <AccordionItem value="a">
          <AccordionTrigger>素焼きは必要ですか</AccordionTrigger>
          <AccordionContent>
            釉薬を掛ける器は、先に 800℃
            ほどで素焼きしておくと扱いやすくなります。焼締なら素焼きは要りません。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>窯出しまでの日数</AccordionTrigger>
          <AccordionContent>
            焼成に一日、冷ましに二日。窯を開けるのは三日目の朝です。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="c">
          <AccordionTrigger>割れた器の扱い</AccordionTrigger>
          <AccordionContent>
            金継ぎの相談も承ります。破片は捨てずにお持ちください。
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <Cap>畳 み — 一 段 だ け の 折 り</Cap>
      <Collapsible className="mb-14 max-w-[560px]">
        <CollapsibleTrigger asChild>
          <Button variant="bare" size="sm">
            詳しい条件 <Glyph name="turn" />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="m-0 pt-3 text-[13.5px] leading-[1.9] tracking-[.04em] text-tz-ink-2">
            窯の容量は一回につき 40 点まで。大物は 2 点分として数えます。
          </p>
        </CollapsibleContent>
      </Collapsible>
    </>
  ),
}
