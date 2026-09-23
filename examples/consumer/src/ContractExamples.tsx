import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardMeta,
  CardText,
  CardTitle,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldNote,
  FieldSeparator,
  FieldSet,
  FieldTitle,
  Input,
} from '@mitame-ai/design-system'

// Compiled and rendered from the public package API, never source aliases.
export function ContractExamples() {
  return (
    <aside className="tz-stage examples" aria-label="部品の使用例">
      <h2>部品の使用例</h2>
      <section className="example-row">
        {(['ink', 'contour', 'bare'] as const).map((variant) => (
          <Button
            key={variant}
            variant={variant}
            data-contract={`component.button:variant:${variant}`}
          >
            {variant}
          </Button>
        ))}
      </section>
      <section className="example-row">
        {(['sm', 'md', 'lg', 'icon', 'icon-sm'] as const).map((size) => (
          <Button
            key={size}
            size={size}
            aria-label={size}
            data-contract={`component.button:size:${size}`}
          >
            {size.startsWith('icon') ? '＋' : size}
          </Button>
        ))}
      </section>
      <section className="example-row">
        <Button loading disabled>
          準備中
        </Button>
        <Button asChild variant="bare">
          <a href="#root">先頭へ</a>
        </Button>
      </section>
      {(['rule', 'boxed'] as const).map((variant) => (
        <Field key={variant}>
          <FieldLabel htmlFor={`example-${variant}`}>{variant}</FieldLabel>
          <Input
            id={`example-${variant}`}
            variant={variant}
            wrapperClassName="example-input"
            data-contract={`component.input:variant:${variant}`}
          />
        </Field>
      ))}
      {(['vertical', 'horizontal', 'responsive'] as const).map((orientation) => (
        <Field
          key={orientation}
          orientation={orientation}
          data-contract={`component.field:orientation:${orientation}`}
        >
          <FieldContent>
            <FieldLabel htmlFor={`field-${orientation}`}>{orientation}</FieldLabel>
            <FieldDescription>名前の記入欄</FieldDescription>
          </FieldContent>
          <Input id={`field-${orientation}`} />
        </Field>
      ))}
      <FieldSet>
        <FieldLegend>補助の部品</FieldLegend>
        <FieldGroup>
          <Field invalid>
            <FieldTitle>記入の確認</FieldTitle>
            <FieldNote>朱は訂正のために使います。</FieldNote>
            <FieldError errors={[{ message: '記入内容を確認してください。' }]} />
          </Field>
          <FieldSeparator>区切り</FieldSeparator>
        </FieldGroup>
      </FieldSet>
      {(['plain', 'pick', 'inlay'] as const).map((variant) => (
        <Card key={variant} variant={variant} data-contract={`component.card:variant:${variant}`}>
          <CardHeader>
            <CardTitle>{variant}</CardTitle>
            <CardDescription>紙のまとまり</CardDescription>
            <CardAction>
              <Button variant="bare">読む</Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <CardText>部品の中でも、それぞれの輪郭を保ちます。</CardText>
            <CardMedia />
          </CardContent>
          <CardFooter>
            <CardMeta>手触り</CardMeta>
          </CardFooter>
        </Card>
      ))}
      {(['plain', 'shu'] as const).map((variant) => (
        <Alert key={variant} variant={variant} data-contract={`component.alert:variant:${variant}`}>
          <AlertTitle>{variant}</AlertTitle>
          <AlertDescription>知らせを読み、次の操作を選べます。</AlertDescription>
          <AlertAction>
            <Button variant="bare">確認</Button>
          </AlertAction>
        </Alert>
      ))}
    </aside>
  )
}
