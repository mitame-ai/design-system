import assert from 'node:assert/strict'
import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import test from 'node:test'
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'

/* SSR の検証 — 配布物（dist/index.js）を Node で直接レンダリングする。
   サーバーでは効果が走らないため、描画エンジンの登録・装飾はハイドレーション後に行われる。
   ここでは「描画できること」「二度描いて同じ結果になること」「内容が SSR HTML に現れること」を確かめる。 */

const root = resolve(import.meta.dirname, '..')
const entry = resolve(root, 'dist/index.js')
assert(existsSync(entry), 'dist/index.js がありません。先に `pnpm build` を実行してください')
const DS = await import(entry)

const render = (el) => renderToString(el)

test('the distributed bundle declares the client boundary for RSC consumers', () => {
  assert(/^['"]use client['"]/.test(readFileSync(entry, 'utf8')))
})

test('core components render on the server without a DOM', () => {
  const page = h(
    'div',
    null,
    h(DS.Button, { variant: 'ink' }, '保存する'),
    h(DS.Button, { variant: 'contour', loading: true }, '送信中'),
    h(
      DS.Field,
      null,
      h(DS.FieldLabel, { htmlFor: 'name' }, '名前'),
      h(DS.Input, { id: 'name', defaultValue: '山田' }),
    ),
    h(DS.TextArea, { rows: 3, defaultValue: '本文' }),
    h(
      DS.Card,
      null,
      h(DS.CardHeader, null, h(DS.CardTitle, null, '題')),
      h(DS.CardContent, null, '中身'),
    ),
    h(DS.Alert, { variant: 'shu' }, h(DS.AlertTitle, null, '注意')),
    h(DS.Badge, null, '札'),
    h(DS.Rule, null),
    h(DS.Separator, null),
    h(DS.Progress, { value: 40 }),
    h(DS.Slider, { defaultValue: [30, 70] }),
    h(DS.Checkbox, null),
    h(
      DS.RadioGroup,
      null,
      h(DS.RadioGroupItem, { value: 'a' }),
      h(DS.RadioGroupItem, { value: 'b' }),
    ),
    h(DS.Switch, null),
    h(DS.Toggle, null, '押し込み'),
    h(DS.Skeleton, { style: { width: 120, height: 16 } }),
    h(DS.Spinner, null),
    h(
      DS.Table,
      null,
      h(DS.TableHeader, null, h(DS.TableRow, null, h(DS.TableHead, null, '列'))),
      h(DS.TableBody, null, h(DS.TableRow, null, h(DS.TableCell, null, '値'))),
    ),
    h(
      DS.Tabs,
      { defaultValue: 'one' },
      h(DS.TabsList, null, h(DS.TabsTrigger, { value: 'one' }, '一')),
      h(DS.TabsContent, { value: 'one' }, '頁一'),
    ),
    h(
      DS.Accordion,
      { type: 'single', collapsible: true },
      h(
        DS.AccordionItem,
        { value: 'x' },
        h(DS.AccordionTrigger, null, '折り'),
        h(DS.AccordionContent, null, '中身'),
      ),
    ),
    h(DS.Kbd, null, 'A'),
    h(DS.Icon, null, h('path', { d: 'M2 8 H14' })),
    h(DS.PaperGrain, null),
    h(DS.Toaster, null),
    h(
      DS.MessageScroller,
      null,
      h(
        DS.MessageScrollerViewport,
        null,
        h(DS.MessageScrollerContent, null, h(DS.MessageScrollerItem, null, '発言')),
      ),
      h(DS.MessageScrollerButton, null),
    ),
  )
  const html = render(page)
  assert(html.includes('保存する'))
  assert(html.includes('tz-shell'))
  /* 罫や印の SVG がサーバーの HTML にも残る */
  assert(html.includes('<svg'))
})

test('server output is deterministic across renders (no hydration-divergent randomness)', () => {
  const tree = h(
    'div',
    null,
    h(
      DS.SidebarProvider,
      null,
      h(DS.SidebarMenuSkeleton, { showIcon: true }),
      h(DS.SidebarMenuSkeleton, null),
    ),
    h(DS.Mark, { kind: 'tick' }),
    h(DS.Mark, { kind: 'circle' }),
    h(DS.Badge, null, '札'),
    h(DS.Progress, { value: 40 }),
  )
  assert.equal(render(tree), render(tree))
})

test('Questionnaire SSR renders the first item, progress and next action', () => {
  const page = h(
    DS.Questionnaire,
    null,
    h(DS.QuestionnaireProgress, null),
    h(
      DS.QuestionnaireItem,
      { name: 'first', required: true },
      h(DS.QuestionnaireTitle, null, '最初の問い'),
      h(
        DS.QuestionnaireChoices,
        null,
        h(DS.QuestionnaireChoice, { value: 'a' }, '甲'),
        h(DS.QuestionnaireChoice, { value: 'b' }, '乙'),
      ),
    ),
    h(DS.QuestionnaireItem, { name: 'second' }, h(DS.QuestionnaireTitle, null, '次の問い')),
    h(
      DS.QuestionnaireActions,
      null,
      h(DS.QuestionnairePrevious, null),
      h(DS.QuestionnaireNext, null),
      h(DS.QuestionnaireSubmit, null),
    ),
  )
  const html = render(page)
  const text = html.replace(/<!--.*?-->/g, '')
  assert(html.includes('最初の問い'), 'first item is present in SSR HTML')
  assert(!html.includes('次の問い'), 'later items stay hidden until mounted')
  assert(text.includes('1 / 2'), `progress shows the declared total: ${text}`)
  assert(html.includes('次へ'), 'next action renders for the first item')
  assert(!html.includes('答えを送る'), 'submit action does not leak onto the first item')
})

test('Select SSR renders the chosen label instead of the placeholder', () => {
  const page = h(
    DS.Select,
    { defaultValue: 'second' },
    h(DS.SelectTrigger, null, h(DS.SelectValue, { placeholder: '未選択' })),
    h(
      DS.SelectContent,
      null,
      h(DS.SelectItem, { value: 'first' }, '最初の札'),
      h(DS.SelectItem, { value: 'second' }, '次の札'),
    ),
  )
  const html = render(page)
  assert(html.includes('次の札'), 'chosen item label is written into SSR HTML')
  assert(!html.includes('未選択'), 'placeholder is not used when a value is chosen')
})

test('Combobox SSR writes the chosen label into the input', () => {
  const page = h(
    DS.Combobox,
    { defaultValue: 'b' },
    h(DS.ComboboxInput, null),
    h(
      DS.ComboboxContent,
      null,
      h(DS.ComboboxItem, { value: 'a' }, '候補いち'),
      h(DS.ComboboxItem, { value: 'b' }, '候補に'),
    ),
  )
  const html = render(page)
  assert(html.includes('value="候補に"'), `chosen label lands in the input: ${html}`)
})
