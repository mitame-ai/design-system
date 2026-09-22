# 手触り / Tezawari

[DESIGN.md](DESIGN.md) のデザイン言語を React コンポーネントにしたもの。
単一ファイルの参照実装 [index.html](index.html) はそのまま残してある。

```bash
pnpm install
pnpm storybook   # http://localhost:6006
```

| | |
|---|---|
| `pnpm build` | `dist/index.js` + `dist/index.d.ts` + `dist/tezawari.css` |
| `pnpm typecheck` | tsc |
| `pnpm check` / `pnpm fix` | Biome |
| `pnpm storybook` / `pnpm build-storybook` | Storybook |

## 使う

```tsx
import '@mitame-ai/tezawari/styles.css'
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mitame-ai/tezawari'

<Button variant="ink">仕立てる</Button>
```

スタイルは JS から自動では読み込まれない。`styles.css` を一度だけ読み込む。

Tailwind を使っているなら、トークンをテーマに流し込める。
`bg-tz-paper` / `text-tz-ink` / `font-tz` などが使えるようになる。

```css
@import 'tailwindcss';
@import '@mitame-ai/tezawari/theme.css';
@import '@mitame-ai/tezawari/styles.css';
```

面として使うときは、紙の繊維を敷いて `.tz-stage` を当てる。
部品を一つ置くだけなら要らない。

```tsx
<PaperGrain />
<div className="tz-stage">…</div>
```

## 部品

| | variant | 備考 |
|---|---|---|
| `Button` | `ink` / `contour` / `bare` | `size`: `sm` `md` `lg` `icon`、`loading`、`asChild` |
| `Input` | `rule` / `boxed` | ref は内側の `<input>` に向く |
| `TextArea` | — | 原稿用紙。`rows` の数だけ罫が引かれる |
| `Select` | — | `Select` / `SelectTrigger` / `SelectValue` / `SelectContent` / `SelectItem` |
| `Card` | `plain` / `pick` / `inlay` | `CardTitle` / `CardText` / `CardMeta` / `CardFooter` / `CardMedia` |
| `Panel` | — | 織り。画像の代わりに使う面 |
| `Field` | — | `FieldLabel` / `FieldNote`、`invalid` で朱が入る |
| `Rule` | — | 手で引いた罫 |
| `Icon` | — | `.tz-ico`。線は繊維のフィルタを通る |

variant の名前は index.html の `--ink` / `--contour` / `--bare` をそのまま使っている。
shadcn の `default` / `outline` / `ghost` には読み替えていない。

`reseed()` を呼ぶと大域の種が進み、全個体が焼き直される。

## 作り

```
src/
  lib/tezawari/   塗師。index.html の <script> をほぼ逐語で移した
    random / geometry / paint / deform / sense / ink / defs / registry
  hooks/          useTezawari : 要素を塗師に預ける
  components/     部品と Story
  styles/
    properties.css  @property。レイヤの外に置く
    components.css  index.html の <style> の逐語移植
    theme.css       Tailwind のテーマに流し込む分
    tezawari.css    配布する入口 (properties + components)
    index.css       開発と Storybook の入口 (Tailwind 込み)
```

殻 (`.tz-shell`) は JSX 側で描き、その中身は塗師が `innerHTML` で書き込む。
React は殻の中を知らないので、命令的な書き換えと衝突しない。

輪郭の種は `className + textContent` と、同じ指定のなかでの席の番号から決まる。
同じ指定の四つのボタンは四つとも違う輪郭を持ち、再読み込みしても各個体は同じ形に戻る。
固定したいときは `seed` を渡す。

### 触るときの注意

- `@property` を `@layer` の中に入れない。入れると補間されず、ばねが死ぬ
- 層の CSS は `> .tz-shell` で自分の殻に限定する。子孫セレクタは入れ子の部品に漏れる
- カスタムプロパティは継承するので、部品は作りのトークンを全部自分で書く
- `src/styles/components.css` は index.html との差分を見られるように整形しない
  (Biome の formatter を `src/styles/**` で切ってある)
