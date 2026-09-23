import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  PaperGrain,
} from '@mitame-ai/design-system'
import { type FormEvent, useRef, useState } from 'react'
import { ContractExamples } from './ContractExamples'

export function App() {
  const [name, setName] = useState('山田 花子')
  const [status, setStatus] = useState<'idle' | 'invalid' | 'pending' | 'error' | 'success'>('idle')
  const saving = useRef(false)
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving.current) return
    if (!name.trim()) {
      setStatus('invalid')
      return
    }
    saving.current = true
    setStatus('pending')
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: name }),
      })
      if (!response.ok) throw new Error('Save failed')
      setStatus('success')
    } catch {
      // Keep the edit for retry; the harness proves this behavior with an isolated defective build.
      setStatus('error')
    } finally {
      saving.current = false
    }
  }
  return (
    <>
      <PaperGrain />
      <main className="tz-stage page">
        <header>
          <p className="eyebrow">手触り / Tezawari</p>
          <h1>プロフィール</h1>
          <p>あなたの名前を、いつもの呼び方で。</p>
        </header>
        <Card seed="profile-card">
          <CardContent>
            <form noValidate onSubmit={save}>
              <Field invalid={status === 'invalid'}>
                <FieldLabel htmlFor="display-name" required>
                  表示名
                </FieldLabel>
                <Input
                  id="display-name"
                  seed="profile-input"
                  required
                  disabled={status === 'pending'}
                  value={name}
                  aria-invalid={status === 'invalid' || undefined}
                  aria-describedby={status === 'invalid' ? 'name-error' : 'name-help'}
                  onChange={(event) => {
                    setName(event.target.value)
                    if (status !== 'pending') setStatus('idle')
                  }}
                />
                <FieldDescription id="name-help">ほかの人に表示する名前です。</FieldDescription>
                {status === 'invalid' && (
                  <FieldError id="name-error">表示名を入力してください。</FieldError>
                )}
              </Field>
              {status === 'error' && (
                <Alert variant="shu" seed="save-error">
                  <AlertTitle>もう一度、保存できます</AlertTitle>
                  <AlertDescription>
                    保存できませんでした。入力内容を確認して、もう一度お試しください。
                  </AlertDescription>
                </Alert>
              )}
              {status === 'success' && (
                <Alert role="status" seed="save-success">
                  <AlertDescription>保存しました。</AlertDescription>
                </Alert>
              )}
              <div className="actions">
                <Button
                  type="submit"
                  seed="profile-save"
                  loading={status === 'pending'}
                  disabled={status === 'pending'}
                >
                  保存する
                </Button>
                <span role="status">{status === 'pending' ? '保存中…' : ''}</span>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
      <ContractExamples />
    </>
  )
}
