# 手触り / Tezawari

[DESIGN.md](DESIGN.md) で定義されたデザイン言語に基づく React コンポーネントライブラリです。
単一ファイルによる参照実装（[index.html](index.html)）も同梱しています。

```bash
pnpm install
pnpm storybook   # http://localhost:6006
```

| コマンド | 説明 |
|---|---|
| `pnpm build` | ライブラリのビルド（`dist/index.js` + `dist/index.d.ts` + `dist/tezawari.css`） |
| `pnpm typecheck` | TypeScript 型チェック（tsc） |
| `pnpm check` / `pnpm fix` | Biome による静的解析と自動修正 |
| `pnpm storybook` / `pnpm build-storybook` | Storybook の開発サーバー起動 / 静的ビルド |

## 使い方

```tsx
import '@mitame-ai/tezawari/styles.css'
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mitame-ai/tezawari'

<Button variant="ink">仕立てる</Button>
```

スタイルシートは JS から自動的にはインポートされないため、アプリケーションのエントリポイントで `styles.css` を一度読み込んでください。

Tailwind CSS をお使いの場合は、テーマファイルを読み込むことでトークンを利用できます。
`bg-tz-paper`、`text-tz-ink`、`font-tz` などのユーティリティクラスが有効になります。

```css
@import 'tailwindcss';
@import '@mitame-ai/tezawari/theme.css';
@import '@mitame-ai/tezawari/styles.css';
```

画面全体で Tezawari の世界観を再現する場合は、背景用のテクスチャ `<PaperGrain />` を配置し、コンテナ要素に `.tz-stage` クラスを指定します。個別のコンポーネントを単体で使用する場合は必須ではありません。

```tsx
<PaperGrain />
<div className="tz-stage">…</div>
```

## コンポーネント一覧

| コンポーネント | variant | 備考 |
|---|---|---|
| `Button` | `ink` / `contour` / `bare` | `size`: `sm` `md` `lg` `icon`、`loading`、`asChild` 対応 |
| `Input` | `rule` / `boxed` | ref は内部の `<input>` 要素に転送されます |
| `TextArea` | — | 原稿用紙風の入力欄。`rows` の指定行数分だけ罫線が描画されます |
| `Select` | — | `Select` / `SelectTrigger` / `SelectValue` / `SelectContent` / `SelectItem` |
| `Card` | `plain` / `pick` / `inlay` | `CardTitle` / `CardText` / `CardMeta` / `CardFooter` / `CardMedia` |
| `Panel` | — | テクスチャパネル。画像プレースホルダーなどに使用します |
| `Field` | — | `FieldLabel` / `FieldNote` を内包し、`invalid` 時に朱色の訂正線が表示されます |
| `Rule` | — | 手描き風の水平罫線 |
| `Icon` | — | アイコン用ラッパー（`.tz-ico`）。繊維感のある SVG フィルターを通します |

variant 名は `index.html` の設計（`--ink` / `--contour` / `--bare`）を踏襲しています（shadcn の `default` / `outline` / `ghost` への読み替えは行っていません）。

`reseed()` を呼び出すとグローバルシードが更新され、全コンポーネントの形状・ゆらぎが再生成（再描画）されます。

## アーキテクチャとディレクトリ構成

```
src/
  lib/tezawari/   描画エンジン。index.html の <script> ロジックをモジュール化したもの
    random / geometry / paint / deform / sense / ink / defs / registry
  hooks/          useTezawari : DOM 要素を描画エンジンに登録するカスタムフック
  components/     UI コンポーネントと Storybook 定義
  styles/
    properties.css  @property 定義（CSS @layer 外で読み込む）
    components.css  index.html の <style> を移植したスタイル定義
    theme.css       Tailwind CSS 向けテーマ定義
    tezawari.css    配布用メインスタイル（properties + components）
    index.css       開発環境・Storybook 用エントリスタイル（Tailwind 含む）
```

外枠となるシェル要素（`.tz-shell`）は JSX 側でレンダリングし、その内部の SVG 要素は描画エンジンが `innerHTML` 経由で直接生成・更新します。React の仮想 DOM 管理外で処理されるため、命令的な DOM 操作と競合しません。

各コンポーネントの輪郭シード値は `className`、`textContent`、および DOM ツリー内の出現順（インデックス）から決定されます。そのため同一プロパティのボタンを複数並べてもそれぞれ固有のゆらぎを持ち、ページを再読み込みしても同一の形状が保たれます。形状を明示的に固定したい場合は `seed` プロパティを指定します。

### 開発・カスタマイズ時の注意点

- `@property` は `@layer` の内側に配置しないでください（ブラウザの仕様によりアニメーションの補間が無効化されます）。
- 各レイヤーのスタイルは `> .tz-shell` のように直下の子セレクタで限定してください（子孫セレクタを使うと、ネストされた子コンポーネントにスタイルが漏れてしまいます）。
- CSS カスタムプロパティは親要素から継承されるため、各コンポーネントでスタイル用トークンを明示的に定義してください（親要素の値が予期せず適用されるのを防ぐため）。
- `src/styles/components.css` は `index.html` との差分を追跡しやすくするため、あえてフォーマットを行っていません（Biome のフォーマッタ対象から除外されています）。
