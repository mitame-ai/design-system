# 手触り / Tezawari

手触りのデザイン言語に基づく React コンポーネントライブラリです。
利用側のデザイン原則とハーネスの手順は [DESIGN.md](DESIGN.md) を参照してください。
ソースリポジトリには単一ファイルの参照実装 `index.html` と、保守者向け設計資料 `DESIGN.local.md` があります。これらはパッケージの配布対象外です。

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

## 他のアプリにインストール

利用側には React 18 または 19 が必要です。ハーネスの CLI / MCP には Node.js 22 以上を使います。

GitHub Packages から導入する場合は、利用側のプロジェクトに次の `.npmrc` を置きます。
GitHub Packages は公開パッケージの取得にも認証が必要です。`GITHUB_PACKAGES_TOKEN` には
`read:packages` 権限のある GitHub personal access token (classic) を環境変数として渡し、
トークンの値をファイルや Git に保存しないでください。

```ini
@mitame-ai:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${GITHUB_PACKAGES_TOKEN}
```

次に、**利用するアプリのディレクトリ**でインストールします。

```sh
pnpm add @mitame-ai/design-system@0.1.0
pnpm exec tezawari-design install-skills .
pnpm exec tezawari-design resolve scenario.profile-edit
```

既存アプリのパッケージマネージャーと lockfile を継続して使ってください。
ローカルのソースから導入する場合は、このリポジトリで配布用の tarball を作成します。

```sh
pnpm install --frozen-lockfile
pnpm design:generate
pnpm build
pnpm pack --pack-destination ./test-results/packages
```

次に、**利用するアプリのディレクトリ**で生成されたファイルをインストールします。
パスは実際の tarball の絶対パスに置き換えてください。

```sh
pnpm add /path/to/mitame-ai-design-system-0.1.0.tgz
pnpm exec tezawari-design install-skills .
pnpm exec tezawari-design resolve scenario.profile-edit
```

tarball で導入する場合、GitHub Packages 用の `.npmrc` は不要です。

次の「使い方」に従って CSS とコンポーネントを読み込み、利用側のビルドとプレビューで確認します。
`install-skills` は `tezawari-install`・`tezawari-build`・`tezawari-review`・`tezawari-improve` を
プロジェクトの `.agents/skills/` に配置します。エージェントに導入を依頼する場合は
[tezawari-install](.agents/skills/tezawari-install/SKILL.md) を使ってください。
MCP、更新・削除、検証範囲の詳細は [DESIGN.md](DESIGN.md) にあります。

### パッケージの公開

保守側は `package.json` のバージョンを更新して検証し、同じ番号の `v<version>` タグから
GitHub Release を公開します。Release の公開時に GitHub Actions が `pnpm design:check` を実行し、
成功した版を GitHub Packages に公開します。既存のバージョンは再公開できません。

## 使い方

```tsx
import '@mitame-ai/design-system/styles.css'
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@mitame-ai/design-system'

<Button variant="ink">仕立てる</Button>
```

スタイルシートは JS から自動的にはインポートされないため、アプリケーションのエントリポイントで `styles.css` を一度読み込んでください。

Tailwind CSS をお使いの場合は、テーマファイルを読み込むことでトークンを利用できます。
`bg-tz-paper`、`text-tz-ink`、`font-tz` などのユーティリティクラスが有効になります。

```css
@import 'tailwindcss';
@import '@mitame-ai/design-system/theme.css';
@import '@mitame-ai/design-system/styles.css';
```

画面全体で Tezawari の世界観を再現する場合は、背景用のテクスチャ `<PaperGrain />` を配置し、コンテナ要素に `.tz-stage` クラスを指定します。個別のコンポーネントを単体で使用する場合は必須ではありません。

```tsx
<PaperGrain />
<div className="tz-stage">…</div>
```

## コンポーネント一覧

役割と API は shadcn/ui に倣い、見た目と動きは [DESIGN.md](DESIGN.md) に従います。
各部品の描画実装（面、印、罫）の詳細は、ソースリポジトリの `DESIGN.local.md` の「拡張部品」を参照してください。

### 基本の四部品とその周り

| コンポーネント | variant | 備考 |
|---|---|---|
| `Button` | `ink` / `contour` / `bare` | `size`: `sm` `md` `lg` `icon` `icon-sm`、`loading`、`asChild` 対応 |
| `Input` | `rule` / `boxed` | ref は内部の `<input>` 要素に転送されます |
| `TextArea`（別名 `Textarea`） | — | 原稿用紙風の入力欄。`rows` の指定行数分だけ罫線が描画されます |
| `Select` | — | `SelectTrigger` / `SelectValue` / `SelectContent` / `SelectItem` / `SelectGroup` / `SelectLabel` / `SelectSeparator` |
| `Card` | `plain` / `pick` / `inlay` | `CardHeader` / `CardTitle` / `CardDescription`（= `CardText`） / `CardAction` / `CardContent` / `CardMeta` / `CardFooter` / `CardMedia` |
| `Panel` | — | テクスチャパネル。画像プレースホルダーなどに使用します |
| `Field` | — | `orientation`: `vertical` `horizontal` `responsive`。`FieldLabel` / `FieldNote`（= `FieldDescription`） / `FieldError` / `FieldContent` / `FieldTitle` / `FieldGroup` / `FieldSet` / `FieldLegend` / `FieldSeparator` |
| `Rule` | — | 手描き風の罫線。`orientation="vertical"` で縦に引きます |
| `Icon` | — | アイコン用ラッパー（`.tz-ico`）。繊維感のある SVG フィルターを通します |

### 入力と選択

| コンポーネント | variant | 備考 |
|---|---|---|
| `Checkbox` | — | 手で書き入れるチェック。`indeterminate` は横の一画 |
| `RadioGroup` | — | `RadioGroupItem`。丸の中に墨を一滴落とします |
| `Switch` | — | `size`: `sm` `md` |
| `Slider` | — | 範囲（値が二つ）、縦、右から左に対応 |
| `Toggle` / `ToggleGroup` | `bare` / `contour` | 入った状態は面が沈むことで示します |
| `InputGroup` | `boxed` / `rule` | `InputGroupAddon`（`align`）/ `InputGroupInput` / `InputGroupTextarea` / `InputGroupButton` / `InputGroupText` |
| `InputOTP` | — | `InputOTPGroup` / `InputOTPSlot` / `InputOTPSeparator`（`input-otp` を使用） |
| `NativeSelect` | `rule` / `boxed` | `NativeSelectOption` / `NativeSelectOptGroup` |
| `Combobox` | — | `ComboboxInput` / `ComboboxContent` / `ComboboxItem` / `ComboboxGroup` / `ComboboxEmpty`（`cmdk` を使用） |
| `Calendar` | — | `react-day-picker` を使用。既定は日本語 |
| `DatePicker` / `DateRangePicker` | — | 罫の引き手と、暦の浮き紙 |
| `Label` | — | 字間を広く取ったラベル |
| `Questionnaire` | — | 一問ずつ答える帳面。`QuestionnaireItem` / `QuestionnaireChoices` / `QuestionnaireChoice` / `QuestionnaireInput` ほか |

### 表示

| コンポーネント | variant | 備考 |
|---|---|---|
| `Alert` | `plain` / `shu` | `AlertTitle` / `AlertDescription` / `AlertAction`。朱は左の傍線で示します |
| `Badge` | `ink` / `contour` / `inlay` / `shu` | `asChild` でリンクにできます |
| `Avatar` | — | `AvatarImage` / `AvatarFallback` / `AvatarBadge` / `AvatarGroup` / `AvatarGroupCount` |
| `Kbd` | — | `KbdGroup` |
| `Spinner` | — | 手縫いの拍で回る待ち |
| `Skeleton` | — | 点線の当たり線で描く下書き |
| `Progress` | — | `value={null}` で値の決まらない待ち |
| `Empty` | — | `EmptyHeader` / `EmptyMedia`（`variant="icon"`）/ `EmptyTitle` / `EmptyDescription` / `EmptyContent` |
| `Item` | `plain` / `outline` / `muted` | `ItemGroup` / `ItemMedia` / `ItemContent` / `ItemTitle` / `ItemDescription` / `ItemActions` ほか |
| `Marker` | `default` / `separator` / `border` | `MarkerIcon` / `MarkerContent` |
| `Separator` | — | 手描きの罫。縦にも引けます |
| `AspectRatio` | — | |
| `Table` | — | 罫は表全体で一つの SVG に引きます |
| `DataTable` | — | 並べ替え、絞り込み、頁送り、行の選択 |
| `Chart` | — | `ChartContainer` / `ChartTooltip` / `ChartTooltipContent` / `ChartLegend` / `ChartLegendContent`（`recharts` を使用） |
| `Carousel` | — | `CarouselContent` / `CarouselItem` / `CarouselPrevious` / `CarouselNext`（`embla-carousel-react` を使用） |
| `ScrollArea` | — | `ScrollBar` |
| `Resizable` | — | `ResizablePanelGroup` / `ResizablePanel` / `ResizableHandle`（`react-resizable-panels` を使用） |
| `Accordion` / `Collapsible` | — | |
| `Tabs` | `line` / `inlay`（`TabsList` に指定） | |

### 移動と重なり

| コンポーネント | 備考 |
|---|---|
| `Breadcrumb` / `Pagination` | 頁送りは、今の頁に丸印を付けます |
| `NavigationMenu` / `Menubar` | |
| `DropdownMenu` / `ContextMenu` | 項目の `variant="shu"` は取り消せない操作に使います |
| `Command` / `CommandDialog` | `cmdk` を使用 |
| `Popover` / `HoverCard` / `Tooltip` | `Tooltip` は `TooltipProvider` を内包しています |
| `Dialog` / `AlertDialog` | |
| `Sheet` / `Drawer` | 引き出しは指で払って閉じられます |
| `Sidebar` | `SidebarProvider` / `Sidebar`（`variant`: `sidebar` `floating` `inset`、`collapsible`: `offcanvas` `icon` `none`）ほか |
| `Toast` | `<Toaster />` を一つ置き、`toast()` / `toast.success()` / `toast.error()` / `toast.promise()` で知らせます |
| `ButtonGroup` | `ButtonGroupText` / `ButtonGroupSeparator` |
| `DirectionProvider` | 文字の流れ（`ltr` / `rtl`）を子孫に伝えます |

### 会話

| コンポーネント | variant | 備考 |
|---|---|---|
| `Bubble` | `ink` / `paper` / `muted` / `contour` / `ghost` / `shu` | `BubbleGroup` / `BubbleContent` / `BubbleReactions` |
| `Message` | — | `MessageGroup` / `MessageAvatar` / `MessageContent` / `MessageHeader` / `MessageFooter` |
| `MessageScroller` | — | 末尾を読んでいるあいだだけ、新しい発言に巻物を送ります。`useMessageScroller` |
| `Attachment` | — | `state`: `idle` `uploading` `processing` `error` `done` |

variant 名は `index.html` の設計（`--ink` / `--contour` / `--bare`）を踏襲しています（shadcn の `default` / `outline` / `ghost` への読み替えは行っていません）。
shadcn の `destructive` に当たる variant は `shu`（朱）です。朱は注意を促すときにだけ使います。

`reseed()` を呼び出すとグローバルシードが更新され、全コンポーネントの形状・ゆらぎが再生成（再描画）されます。

## アーキテクチャとディレクトリ構成

```
src/
  lib/tezawari/   描画エンジン。index.html の <script> ロジックをモジュール化したもの
    random / geometry / paint / deform / sense / ink / defs / registry
  lib/marks.tsx   印（チェック、丸印、墨の点など）と字形（返し、閉じるなど）
  hooks/          useTezawari / useSkin : DOM 要素を描画エンジンに登録するカスタムフック
                  useSalt / useSlip / useIsMobile
  components/     UI コンポーネントと Storybook 定義
  styles/
    properties.css  @property 定義（CSS @layer 外で読み込む）
    components.css  index.html の <style> を移植したスタイル定義
    kit.css, kit/   基本の四部品から広げた部品のスタイル定義
    theme.css       Tailwind CSS 向けテーマ定義
    tezawari.css    配布用メインスタイル（properties + components + kit）
    index.css       開発環境・Storybook 用エントリスタイル（Tailwind 含む）
```

ポップオーバーやメニューの中身のように、開くたびに DOM に現れる要素は `useSkin`（コールバック ref 版）で登録します。

外枠となるシェル要素（`.tz-shell`）は JSX 側でレンダリングし、その内部の SVG 要素は描画エンジンが `innerHTML` 経由で直接生成・更新します。React の仮想 DOM 管理外で処理されるため、命令的な DOM 操作と競合しません。

各コンポーネントの輪郭シード値は `className`、`textContent`、および DOM ツリー内の出現順（インデックス）から決定されます。そのため同一プロパティのボタンを複数並べてもそれぞれ固有のゆらぎを持ち、ページを再読み込みしても同一の形状が保たれます。形状を明示的に固定したい場合は `seed` プロパティを指定します。

### 開発・カスタマイズ時の注意点

- `@property` は `@layer` の内側に配置しないでください（ブラウザの仕様によりアニメーションの補間が無効化されます）。
- 各レイヤーのスタイルは `> .tz-shell` のように直下の子セレクタで限定してください（子孫セレクタを使うと、ネストされた子コンポーネントにスタイルが漏れてしまいます）。
- CSS カスタムプロパティは親要素から継承されるため、各コンポーネントでスタイル用トークンを明示的に定義してください（親要素の値が予期せず適用されるのを防ぐため）。
- `src/styles/components.css` は `index.html` との差分を追跡しやすくするため、あえてフォーマットを行っていません（Biome のフォーマッタ対象から除外されています）。

## 他のアプリで使うデザインハーネス

コンポーネントと同じバージョンで、デザイン契約・検索カタログ・CLI・MCP・タスク用 Skill を配布します。
導入と検証の手順は [DESIGN.md](DESIGN.md) を参照してください。

```sh
pnpm exec tezawari-design install-skills .
pnpm exec tezawari-design resolve scenario.profile-edit
```

保守側では `pnpm design:generate` で参照情報を更新し、`pnpm design:check` で
実際の配布パッケージを使う別アプリ、ブラウザー、MCP、失敗と修正の経路を検証します。
全公開 API を索引化していますが、詳細な動作検証はプロフィール編集のパイロットが対象です。
