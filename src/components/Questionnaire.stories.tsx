import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Cap } from '../stories/layout'
import { Card } from './Card'
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  type QuestionnaireValues,
} from './Questionnaire'

const meta: Meta<typeof Questionnaire> = {
  title: '手触り / Questionnaire',
  component: Questionnaire,
}
export default meta
type Story = StoryObj<typeof Questionnaire>

function Survey() {
  const [done, setDone] = useState<QuestionnaireValues | null>(null)
  if (done)
    return (
      <pre className="m-0 text-[12px] leading-[1.8] text-tz-ink-2">
        {JSON.stringify(done, null, 2)}
      </pre>
    )
  return (
    <Questionnaire onSubmit={setDone}>
      <QuestionnaireProgress />
      <QuestionnaireItem name="clay" required>
        <QuestionnaireTitle>どの土で作りますか</QuestionnaireTitle>
        <QuestionnaireDescription>A / B / C の鍵でも選べます。</QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice value="信楽">
            信楽
            <QuestionnaireChoiceDescription>粗く、火色がよく出る</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="備前">
            備前
            <QuestionnaireChoiceDescription>釉を掛けずに焼き締める</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
          <QuestionnaireChoice value="天草">
            天草
            <QuestionnaireChoiceDescription>白く、磁器になる</QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError />
      </QuestionnaireItem>
      <QuestionnaireItem name="shape" multiple>
        <QuestionnaireTitle>作りたい形（いくつでも）</QuestionnaireTitle>
        <QuestionnaireChoices>
          {['湯呑', '飯碗', '小鉢', '平皿'].map((t) => (
            <QuestionnaireChoice key={t} value={t}>
              {t}
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
      </QuestionnaireItem>
      <QuestionnaireItem name="note">
        <QuestionnaireTitle>ほかに伝えたいこと</QuestionnaireTitle>
        <QuestionnaireInput placeholder="なくても構いません" />
      </QuestionnaireItem>
      <QuestionnaireActions>
        <QuestionnairePrevious />
        <QuestionnaireSkip />
        <QuestionnaireNext />
        <QuestionnaireSubmit />
      </QuestionnaireActions>
    </Questionnaire>
  )
}

export const Playground: Story = {
  name: '問いの帳面',
  render: () => (
    <>
      <Cap>問 い の 帳 面 — 一 問 ず つ 頁 を め く っ て 答 え る</Cap>
      <Card className="mb-14 max-w-[520px]">
        <Survey />
      </Card>
    </>
  ),
}
