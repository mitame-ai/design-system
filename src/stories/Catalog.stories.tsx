import type { Meta, StoryObj } from '@storybook/react-vite'
import { type MouseEvent, useState } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../components/Accordion'
import { Alert, AlertDescription, AlertTitle } from '../components/Alert'
import { AspectRatio } from '../components/AspectRatio'
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
} from '../components/Avatar'
import { Badge } from '../components/Badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/Breadcrumb'
import { Bubble, BubbleContent } from '../components/Bubble'
import { Button } from '../components/Button'
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from '../components/ButtonGroup'
import { Calendar } from '../components/Calendar'
import { Card, CardFooter, CardMedia, CardMeta, CardText, CardTitle } from '../components/Card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../components/Carousel'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../components/Chart'
import { Checkbox } from '../components/Checkbox'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
} from '../components/Combobox'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '../components/Command'
import { DataTable, type DataTableColumn } from '../components/DataTable'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/Dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/DropdownMenu'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '../components/Empty'
import { Field, FieldError, FieldGroup, FieldLabel, FieldNote } from '../components/Field'
import { Icon } from '../components/Icon'
import { Input } from '../components/Input'
import { InputGroup, InputGroupAddon, InputGroupInput } from '../components/InputGroup'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from '../components/Item'
import { Kbd, KbdGroup } from '../components/Kbd'
import { Label } from '../components/Label'
import { Marker, MarkerContent, MarkerIcon } from '../components/Marker'
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from '../components/Message'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '../components/NavigationMenu'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../components/Pagination'
import { Panel } from '../components/Panel'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '../components/Popover'
import { Progress } from '../components/Progress'
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoices,
  QuestionnaireError,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from '../components/Questionnaire'
import { RadioGroup, RadioGroupItem } from '../components/RadioGroup'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../components/Resizable'
import { ScrollArea } from '../components/ScrollArea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/Select'
import { Separator } from '../components/Separator'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../components/Sheet'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '../components/Sidebar'
import { Skeleton } from '../components/Skeleton'
import { Slider } from '../components/Slider'
import { Spinner } from '../components/Spinner'
import { Switch } from '../components/Switch'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/Table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/Tabs'
import { TextArea } from '../components/TextArea'
import { Toaster, toast } from '../components/Toast'
import { Toggle } from '../components/Toggle'
import { ToggleGroup, ToggleGroupItem } from '../components/ToggleGroup'
import { Glyph, type GlyphName } from '../lib/marks'
import { Cards, Fields, Reseed, Row, Sect, Title } from './layout'

const meta = { title: '手触り / 目次' } satisfies Meta
export default meta
type Story = StoryObj<typeof meta>

const photo =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><rect width="40" height="40" fill="#b9ab98"/><circle cx="20" cy="16" r="7" fill="#7d6f60"/><ellipse cx="20" cy="36" rx="13" ry="10" fill="#7d6f60"/></svg>',
  )

const works = [
  ['粉引の湯呑', '信楽の土に白化粧。'],
  ['焼締の片口', '備前の土を釉を掛けずに。'],
  ['灰釉の小鉢', '丹波の土に木灰の釉。'],
  ['白磁の徳利', '天草の陶石から。'],
]

const chartData = [
  { month: '4月', 酸化: 42, 還元: 28 },
  { month: '5月', 酸化: 51, 還元: 34 },
  { month: '6月', 酸化: 38, 還元: 41 },
  { month: '7月', 酸化: 27, 還元: 45 },
]

const chartConfig = {
  酸化: { label: '酸化', color: 'var(--tz-chart-1)' },
  還元: { label: '還元', color: 'var(--tz-chart-3)' },
} satisfies ChartConfig

const 産地 = {
  近畿: ['信楽', '丹波', '伊賀'],
  中国: ['備前', '萩'],
  九州: ['唐津', '有田'],
}

const 土 = ['信楽', '丹波', '備前', '唐津', '萩']

interface Work {
  no: string
  name: string
  clay: string
  state: string
  price: number
}

const tableRows: Work[] = [
  { no: '0412', name: '粉引の湯呑', clay: '信楽', state: '窯出し', price: 4800 },
  { no: '0413', name: '焼締の片口', clay: '備前', state: '乾燥中', price: 9200 },
  { no: '0414', name: '灰釉の小鉢', clay: '丹波', state: '窯出し', price: 3600 },
  { no: '0415', name: '白磁の徳利', clay: '天草', state: '素焼き', price: 12000 },
]

const ledger: Work[] = Array.from({ length: 9 }, (_, i) => ({
  no: String(401 + i).padStart(4, '0'),
  name: `${['粉引', '焼締', '灰釉', '白磁', '織部'][i % 5]}の${['湯呑', '片口', '小鉢', '徳利', '平皿'][i % 5]}`,
  clay: ['信楽', '備前', '丹波', '唐津', '萩'][i % 5] as string,
  state: ['窯出し', '乾燥中', '素焼き'][i % 3] as string,
  price: 2400 + ((i * 1370) % 11000),
}))

const ledgerColumns: DataTableColumn<Work>[] = [
  { id: 'no', header: '番号', sortable: true, className: 'text-tz-ink-3' },
  { id: 'name', header: '名前', sortable: true },
  { id: 'clay', header: '土' },
  {
    id: 'state',
    header: '状態',
    cell: (r) => <Badge variant={r.state === '窯出し' ? 'ink' : 'inlay'}>{r.state}</Badge>,
  },
  {
    id: 'price',
    header: '値',
    sortable: true,
    align: 'end',
    cell: (r) => r.price.toLocaleString(),
  },
]

const scrollTags = Array.from(
  { length: 12 },
  (_, i) => `第 ${i + 1} 窯 — ${['信楽', '備前', '丹波', '萩'][i % 4]}`,
)

const sideNav: [string, GlyphName][] = [
  ['作業台', 'panel'],
  ['作品', 'file'],
  ['窯の記録', 'sun'],
  ['探す', 'search'],
]

const Entry = ({ name, jp }: { name: string; jp: string }) => (
  <Sect>
    {name.toUpperCase().split('').join(' ')} —{' '}
    <span className="font-normal tracking-[.2em] text-tz-ink-3">{jp}</span>
  </Sect>
)

const NavEntry = ({ title, children }: { title: string; children: string }) => (
  <li>
    <NavigationMenuLink href="#c">
      <span className="text-[14px] font-semibold tracking-[.06em]">{title}</span>
      <span className="text-[12.5px] leading-[1.7] tracking-[.04em] text-tz-ink-2">{children}</span>
    </NavigationMenuLink>
  </li>
)

const Pane = ({ children }: { children: string }) => (
  <div className="flex h-full items-center justify-center text-[13px] tracking-[.1em] text-tz-ink-2">
    {children}
  </div>
)

const Body = ({ children }: { children: string }) => (
  <p className="m-0 max-w-[520px] text-[13.5px] leading-[1.9] tracking-[.04em] text-tz-ink-2">
    {children}
  </p>
)

const Bold = () => (
  <Icon>
    <path d="M4.6 2.9 C6.8 2.8 8.9 2.7 9.9 3.6 C11.2 4.8 10.6 7.3 8.4 7.6 C10.8 7.7 12 9.3 11.2 11.2 C10.4 13 7.6 13.1 4.7 13 C4.6 9.6 4.7 6.2 4.6 2.9 M4.8 7.7 L8.3 7.7" />
  </Icon>
)

function CalendarSample() {
  const [d, setD] = useState<Date | undefined>(new Date())
  return <Calendar mode="single" selected={d} onSelect={setD} />
}

function PagerSample() {
  const [page, setPage] = useState(2)
  const go = (p: number) => (e: MouseEvent) => {
    e.preventDefault()
    setPage(Math.min(9, Math.max(1, p)))
  }
  return (
    <Pagination className="mb-14">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#c" onClick={go(page - 1)} />
        </PaginationItem>
        {[1, 2, 3].map((n) => (
          <PaginationItem key={n}>
            <PaginationLink href="#c" isActive={page === n} onClick={go(n)}>
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#c" isActive={page === 9} onClick={go(9)}>
            9
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#c" onClick={go(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export const Index: Story = {
  name: '一覧',
  render: () => (
    <>
      <Title>
        <b>手触り</b>目 次
      </Title>

      <Entry name="Accordion" jp="折り" />
      <Accordion type="single" collapsible defaultValue="a" className="mb-14 max-w-[560px]">
        <AccordionItem value="a">
          <AccordionTrigger>素焼きは必要ですか</AccordionTrigger>
          <AccordionContent>
            釉薬を掛ける器は、先に 800℃ ほどで素焼きしておくと扱いやすくなります。
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>窯出しまでの日数</AccordionTrigger>
          <AccordionContent>
            焼成に一日、冷ましに二日。窯を開けるのは三日目の朝です。
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Entry name="Alert" jp="貼り紙" />
      <div className="mb-14 grid max-w-[560px] gap-6">
        <Alert>
          <Glyph name="info" />
          <AlertTitle>窯入れは明朝 6 時です</AlertTitle>
          <AlertDescription>
            前日の 18 時までに、素焼きを済ませた器を棚に並べてください。
          </AlertDescription>
        </Alert>
        <Alert variant="shu">
          <Glyph name="alert" />
          <AlertTitle>釉薬の在庫が足りません</AlertTitle>
        </Alert>
      </div>

      <Entry name="AspectRatio" jp="縦横比" />
      <div className="mb-14 max-w-[420px]">
        <AspectRatio ratio={16 / 9}>
          <Panel className="h-full" />
        </AspectRatio>
      </div>

      <Entry name="Avatar" jp="顔" />
      <Row>
        <Avatar size="sm">
          <AvatarFallback>土</AvatarFallback>
        </Avatar>
        <Avatar>
          <AvatarImage src={photo} alt="" />
          <AvatarFallback>陶</AvatarFallback>
          <AvatarBadge />
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>窯</AvatarFallback>
        </Avatar>
        <AvatarGroup>
          {['一', '二', '三'].map((t) => (
            <Avatar key={t}>
              <AvatarFallback>{t}</AvatarFallback>
            </Avatar>
          ))}
          <AvatarGroupCount>+4</AvatarGroupCount>
        </AvatarGroup>
      </Row>

      <Entry name="Badge" jp="札" />
      <Row>
        <Badge>窯出し</Badge>
        <Badge variant="contour">信楽</Badge>
        <Badge variant="inlay">在庫 3</Badge>
        <Badge variant="shu">要確認</Badge>
      </Row>

      <Entry name="Breadcrumb" jp="道しるべ" />
      <Breadcrumb className="mb-14">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#c">工房</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#c">作品</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>粉引の湯呑</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Entry name="Button" jp="三態" />
      <Row>
        <Button variant="ink">仕立てる</Button>
        <Button variant="contour">下ごしらえ</Button>
        <Button variant="bare">やめておく</Button>
        <Button variant="ink" size="icon" aria-label="送る">
          <Icon>
            <path d="M2.4 8 H13.2 M8.6 3.6 L13.3 8 L8.6 12.4" />
          </Icon>
        </Button>
      </Row>

      <Entry name="ButtonGroup" jp="組" />
      <Row>
        <ButtonGroup aria-label="編集">
          <Button variant="contour" size="sm">
            写す
          </Button>
          <Button variant="contour" size="sm">
            貼る
          </Button>
          <ButtonGroupSeparator />
          <Button variant="contour" size="icon-sm" aria-label="ほか">
            <Glyph name="more" />
          </Button>
        </ButtonGroup>
        <ButtonGroup aria-label="数量">
          <Button variant="bare" size="icon-sm" aria-label="減らす">
            <Glyph name="minus" />
          </Button>
          <ButtonGroupText>3 点</ButtonGroupText>
          <Button variant="bare" size="icon-sm" aria-label="増やす">
            <Glyph name="plus" />
          </Button>
        </ButtonGroup>
      </Row>

      <Entry name="Calendar" jp="暦" />
      <div className="mb-14">
        <Card variant="inlay" className="w-fit">
          <CalendarSample />
        </Card>
      </div>

      <Entry name="Card" jp="カード" />
      <Cards>
        <Card>
          <CardMedia />
          <CardTitle>粉引の湯呑</CardTitle>
          <CardText>同じ土、同じ窯。それでも一客ずつ縁の厚みが違う。</CardText>
          <CardFooter>
            <CardMeta>窯 出 し 三 日 目</CardMeta>
            <Button variant="bare" size="sm">
              見る
            </Button>
          </CardFooter>
        </Card>
        <Card variant="inlay">
          <CardTitle>インレイカード</CardTitle>
          <CardText>浮かない面。影を持たず、紙に沈んで区切るだけ。</CardText>
        </Card>
      </Cards>

      <Entry name="Carousel" jp="繰り" />
      <div className="mx-[64px] mb-14 max-w-[480px]">
        <Carousel opts={{ align: 'start' }}>
          <CarouselContent>
            {works.map(([t, d]) => (
              <CarouselItem key={t} className="basis-1/2">
                <Card>
                  <CardMedia />
                  <CardTitle>{t}</CardTitle>
                  <CardText>{d}</CardText>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <Entry name="Chart" jp="図" />
      <div className="mb-14 max-w-[420px]">
        <Card>
          <CardTitle>焼いた点数</CardTitle>
          <CardText>月ごと・焼成ごと</CardText>
          <ChartContainer config={chartConfig} className="mt-4">
            <BarChart data={chartData} accessibilityLayer>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar dataKey="酸化" fill="var(--color-酸化)" radius={3} />
              <Bar dataKey="還元" fill="var(--color-還元)" radius={3} />
            </BarChart>
          </ChartContainer>
        </Card>
      </div>

      <Entry name="Checkbox" jp="書き入れる" />
      <div className="mb-14 grid gap-4">
        {['轆轤で挽く', '手びねりで作る'].map((t, i) => (
          <label key={t} className="tz-choice">
            <Checkbox defaultChecked={i === 0} />
            {t}
          </label>
        ))}
        <label className="tz-choice">
          <Checkbox defaultChecked="indeterminate" />
          一部だけ釉を掛ける
        </label>
        <label className="tz-choice">
          <Checkbox disabled />
          窯を借りる（受付終了）
        </label>
      </div>

      <Entry name="Combobox" jp="書いて選ぶ" />
      <Fields>
        <Field>
          <FieldLabel htmlFor="c-clay">産 地</FieldLabel>
          <Combobox defaultValue="備前">
            <ComboboxInput id="c-clay" placeholder="書いて探す" />
            <ComboboxContent>
              <ComboboxEmpty>当てはまる産地がありません</ComboboxEmpty>
              {Object.entries(産地).map(([region, list]) => (
                <ComboboxGroup key={region} heading={region}>
                  {list.map((t) => (
                    <ComboboxItem key={t} value={t}>
                      {t}
                    </ComboboxItem>
                  ))}
                </ComboboxGroup>
              ))}
            </ComboboxContent>
          </Combobox>
        </Field>
      </Fields>

      <Entry name="Command" jp="索引" />
      <div className="mb-14 max-w-[420px]">
        <Command>
          <CommandInput placeholder="探したい言葉を書く" />
          <CommandList>
            <CommandEmpty>当てはまるものがありません</CommandEmpty>
            <CommandGroup heading="よく使う">
              <CommandItem>
                <Glyph name="file" /> 新しい記録
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem>
                <Glyph name="search" /> 作品を探す
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="窯">
              <CommandItem>温度の記録</CommandItem>
              <CommandItem>窯出しの予定</CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>

      <Entry name="DataTable" jp="帳面" />
      <div className="mb-14">
        <DataTable
          columns={ledgerColumns}
          data={ledger}
          getRowId={(r) => r.no}
          filter="名前や土で絞り込む"
          pageSize={5}
        />
      </div>

      <Entry name="Dialog" jp="差し出す紙" />
      <Row>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="contour">屋号を変える</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>屋号を変える</DialogTitle>
              <DialogDescription>変えた屋号は、次の窯出しの札から使われます。</DialogDescription>
            </DialogHeader>
            <Field>
              <FieldLabel htmlFor="c-shop">屋 号</FieldLabel>
              <Input id="c-shop" defaultValue="土と火" />
            </Field>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="bare">やめる</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button>保存する</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Row>

      <Entry name="DropdownMenu" jp="引き出しの札" />
      <Row>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="contour">作品を操作する</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuLabel>作 品</DropdownMenuLabel>
            <DropdownMenuItem>開く</DropdownMenuItem>
            <DropdownMenuItem>写しを作る</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="shu">記録を消す</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Row>

      <Entry name="Empty" jp="空" />
      <div className="mb-14 max-w-[560px]">
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Glyph name="file" />
            </EmptyMedia>
            <EmptyTitle>まだ作品がありません</EmptyTitle>
            <EmptyDescription>最初の一客を登録すると、ここに並びます。</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button>作品を登録する</Button>
            <Button variant="bare">読み込む</Button>
          </EmptyContent>
        </Empty>
      </div>

      <Entry name="Field" jp="束ね" />
      <form className="mb-14 max-w-[520px]" onSubmit={(e) => e.preventDefault()}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="c-name" required>
              名 前
            </FieldLabel>
            <Input id="c-name" placeholder="山田 太郎" />
          </Field>
          <Field invalid>
            <FieldLabel htmlFor="c-count">点 数</FieldLabel>
            <Input id="c-count" defaultValue="52" aria-invalid />
            <FieldError errors={[{ message: '一度に焼けるのは 40 点までです' }]} />
          </Field>
        </FieldGroup>
      </form>

      <Entry name="Input" jp="記入" />
      <Fields>
        <Field>
          <FieldLabel htmlFor="c-input">名 前</FieldLabel>
          <Input id="c-input" placeholder="山田 太郎" />
          <FieldNote>窯元まで届きます</FieldNote>
        </Field>
        <Field>
          <FieldLabel htmlFor="c-boxed">客 数</FieldLabel>
          <Input id="c-boxed" variant="boxed" inputMode="numeric" defaultValue="六" />
        </Field>
      </Fields>

      <Entry name="InputGroup" jp="添え書き" />
      <Fields>
        <Field>
          <FieldLabel htmlFor="c-ig">作 品 を 探 す</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Glyph name="search" />
            </InputGroupAddon>
            <InputGroupInput id="c-ig" placeholder="名前や土で" />
            <InputGroupAddon align="inline-end">
              <Kbd>⌘K</Kbd>
            </InputGroupAddon>
          </InputGroup>
        </Field>
      </Fields>

      <Entry name="Item" jp="項目" />
      <ItemGroup className="mb-14 max-w-[560px]">
        <Item>
          <ItemContent>
            <ItemTitle>素の項目</ItemTitle>
            <ItemDescription>面を持たない。行を区切るのは罫だけ。</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="contour" size="sm">
              開く
            </Button>
          </ItemActions>
        </Item>
        <ItemSeparator />
        <Item variant="muted" asChild>
          <a href="#c-item">
            <ItemContent>
              <ItemTitle>リンクの項目（象嵌）</ItemTitle>
            </ItemContent>
            <Glyph name="next" />
          </a>
        </Item>
      </ItemGroup>

      <Entry name="Kbd" jp="木の札" />
      <Row>
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
        <span className="text-[13px] tracking-[.05em] text-tz-ink-2">
          保存は <Kbd>Ctrl</Kbd> + <Kbd>S</Kbd> で
        </span>
      </Row>

      <Entry name="Label" jp="ラベル" />
      <div className="mb-14 max-w-[420px]">
        <div className="mb-6">
          <Label htmlFor="c-label">屋 号</Label>
          <Input id="c-label" placeholder="例 : 土と火" />
        </div>
        <div className="flex h-5 items-center text-[13px] tracking-[.06em] text-tz-ink-2">
          <span>器</span>
          <Separator orientation="vertical" />
          <span>道具</span>
          <Separator orientation="vertical" />
          <span>窯</span>
        </div>
      </div>

      <Entry name="Marker" jp="目印" />
      <div className="mb-14 grid max-w-[560px] gap-8">
        <Marker>
          <MarkerIcon>
            <Glyph name="info" />
          </MarkerIcon>
          <MarkerContent>
            窯の温度を 1230℃ に変えました · <a href="#c-m">元に戻す</a>
          </MarkerContent>
        </Marker>
        <Marker variant="separator">
          <MarkerContent>9 月 21 日</MarkerContent>
        </Marker>
      </div>

      <Entry name="Message" jp="吹き出し" />
      <div className="mb-14 grid max-w-[560px] gap-6">
        <Message>
          <MessageAvatar>
            <Avatar size="sm">
              <AvatarFallback>佐</AvatarFallback>
            </Avatar>
          </MessageAvatar>
          <MessageContent>
            <MessageHeader>佐藤</MessageHeader>
            <Bubble variant="paper">
              <BubbleContent>窯出しはいつ頃になりそうですか。</BubbleContent>
            </Bubble>
          </MessageContent>
        </Message>
        <Message align="end">
          <MessageContent>
            <Bubble variant="ink">
              <BubbleContent>三日目の朝です。冷ましに二日かかるので。</BubbleContent>
            </Bubble>
            <MessageFooter>既読</MessageFooter>
          </MessageContent>
        </Message>
      </div>

      <Entry name="NavigationMenu" jp="案内" />
      <div className="mb-[200px]">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>工房</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="m-0 grid w-[420px] list-none grid-cols-2 gap-1 p-0">
                  <NavEntry title="成り立ち">信楽で窯を開いたいきさつ。</NavEntry>
                  <NavEntry title="道具">轆轤、鉋、窯の話。</NavEntry>
                  <NavEntry title="土">使っている土と、その配合。</NavEntry>
                  <NavEntry title="窯">穴窯と電気窯の使い分け。</NavEntry>
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#c-nav">便り</NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      <Entry name="Pagination" jp="頁送り" />
      <PagerSample />

      <Entry name="Panel" jp="パネル" />
      <div className="mb-14 flex flex-wrap items-end gap-6">
        <Panel className="h-[56px] w-[120px]" />
        <Panel className="h-[104px] w-[220px]" />
        <Panel className="h-[160px] w-[340px]" />
      </div>

      <Entry name="Popover" jp="浮き紙" />
      <Row>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="contour">寸法を変える</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>寸法</PopoverTitle>
              <PopoverDescription>器の口径と高さを決めます。</PopoverDescription>
            </PopoverHeader>
            <div className="grid gap-4">
              <Field>
                <FieldLabel htmlFor="c-pw">口 径</FieldLabel>
                <Input id="c-pw" defaultValue="8.5 cm" />
              </Field>
            </div>
          </PopoverContent>
        </Popover>
      </Row>

      <Entry name="Progress" jp="進み" />
      <div className="mb-14 grid max-w-[420px] gap-3">
        <span className="text-[12px] tracking-[.12em] text-tz-ink-3">乾燥 62%</span>
        <Progress value={62} aria-label="乾燥" />
        <Progress value={null} aria-label="準備中" />
      </div>

      <Entry name="Questionnaire" jp="問いの帳面" />
      <Card className="mb-14 max-w-[520px]">
        <Questionnaire>
          <QuestionnaireProgress />
          <QuestionnaireItem name="clay" required>
            <QuestionnaireTitle>どの土で作りますか</QuestionnaireTitle>
            <QuestionnaireChoices>
              <QuestionnaireChoice value="信楽">信楽</QuestionnaireChoice>
              <QuestionnaireChoice value="備前">備前</QuestionnaireChoice>
              <QuestionnaireChoice value="天草">天草</QuestionnaireChoice>
            </QuestionnaireChoices>
            <QuestionnaireError />
          </QuestionnaireItem>
          <QuestionnaireActions>
            <QuestionnairePrevious />
            <QuestionnaireSkip />
            <QuestionnaireNext />
            <QuestionnaireSubmit />
          </QuestionnaireActions>
        </Questionnaire>
      </Card>

      <Entry name="RadioGroup" jp="丸に墨" />
      <RadioGroup defaultValue="還元" className="mb-14" aria-label="焼成">
        {['酸化', '還元', '焼締'].map((t) => (
          <label key={t} className="tz-choice">
            <RadioGroupItem value={t} />
            {t}
          </label>
        ))}
      </RadioGroup>

      <Entry name="Resizable" jp="仕切り" />
      <Card variant="inlay" className="mb-14 h-[220px] max-w-[620px] p-2">
        <ResizablePanelGroup orientation="horizontal">
          <ResizablePanel defaultSize="30%">
            <Pane>棚</Pane>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="70%">
            <ResizablePanelGroup orientation="vertical">
              <ResizablePanel defaultSize="60%">
                <Pane>作業台</Pane>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize="40%">
                <Pane>記録</Pane>
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </Card>

      <Entry name="ScrollArea" jp="巻物" />
      <div className="mb-14 max-w-[300px]">
        <Card variant="inlay" className="p-0">
          <ScrollArea className="h-[200px]">
            <div className="px-5 py-4">
              {scrollTags.map((t) => (
                <div key={t}>
                  <p className="m-0 py-1 text-[13px] tracking-[.04em] text-tz-ink-2">{t}</p>
                  <Separator className="my-1" />
                </div>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>

      <Entry name="Select" jp="選ぶ" />
      <Fields>
        <Field>
          <FieldLabel asSpan id="c-soil">
            土
          </FieldLabel>
          <Select defaultValue="信楽">
            <SelectTrigger aria-labelledby="c-soil">
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
        </Field>
      </Fields>

      <Entry name="Sheet" jp="差し込み紙" />
      <Row>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="contour">右から差し込む</Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>作品の情報</SheetTitle>
              <SheetDescription>名前と値を書き換えられます。</SheetDescription>
            </SheetHeader>
            <Field>
              <FieldLabel htmlFor="c-sheet">名 前</FieldLabel>
              <Input id="c-sheet" defaultValue="粉引の湯呑" />
            </Field>
            <SheetFooter>
              <SheetClose asChild>
                <Button>保存する</Button>
              </SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </Row>

      <Entry name="Sidebar" jp="脇の帳" />
      <div
        className="relative mb-14 h-[300px] overflow-hidden rounded-md"
        style={{ transform: 'translateZ(0)' }}
      >
        <SidebarProvider className="min-h-full">
          <Sidebar collapsible="icon">
            <SidebarHeader>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton size="lg" tooltip="土と火">
                    <Avatar size="sm">
                      <AvatarFallback>土</AvatarFallback>
                    </Avatar>
                    <span>土と火</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>工 房</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {sideNav.map(([t, g]) => (
                      <SidebarMenuItem key={t}>
                        <SidebarMenuButton isActive={t === '作品'} tooltip={t}>
                          <Glyph name={g} />
                          <span>{t}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
          <SidebarInset>
            <header className="flex items-center gap-3 px-4 py-3">
              <SidebarTrigger />
              <span className="text-[13px] tracking-[.08em]">作品</span>
            </header>
          </SidebarInset>
        </SidebarProvider>
      </div>

      <Entry name="Skeleton" jp="下書き" />
      <div className="mb-14 flex max-w-[420px] items-center gap-4">
        <Skeleton className="size-12 shrink-0 rounded-full" />
        <div className="grid flex-1 gap-2.5">
          <Skeleton className="h-3.5 w-4/5" />
          <Skeleton className="h-3.5 w-3/5" />
        </div>
      </div>

      <Entry name="Slider" jp="滑らせる" />
      <div className="mb-14 max-w-[420px]">
        <Slider defaultValue={[35]} aria-label="焼成温度" />
      </div>

      <Entry name="Spinner" jp="待ち" />
      <Row>
        <Spinner />
        <Spinner className="text-[28px]" />
        <span className="flex items-center gap-2 text-[13px] tracking-[.05em] text-tz-ink-2">
          <Spinner /> 窯を温めています
        </span>
      </Row>

      <Entry name="Switch" jp="切り替える" />
      <Row>
        <div className="flex items-center gap-3">
          <Switch id="c-s1" defaultChecked />
          <Label htmlFor="c-s1">窯の火を入れる</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="c-s2" />
          <Label htmlFor="c-s2">通知を受け取る</Label>
        </div>
      </Row>

      <Entry name="Table" jp="表" />
      <div className="mb-14">
        <Table>
          <TableCaption>9 月の窯入れ分</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>番号</TableHead>
              <TableHead>名前</TableHead>
              <TableHead>土</TableHead>
              <TableHead>状態</TableHead>
              <TableHead className="text-right">値</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((r) => (
              <TableRow key={r.no}>
                <TableCell className="text-tz-ink-3">{r.no}</TableCell>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.clay}</TableCell>
                <TableCell>
                  <Badge variant={r.state === '窯出し' ? 'ink' : 'inlay'}>{r.state}</Badge>
                </TableCell>
                <TableCell className="text-right">{r.price.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Entry name="Tabs" jp="見出し" />
      <Tabs defaultValue="clay" className="mb-14">
        <TabsList aria-label="工程">
          <TabsTrigger value="clay">土練り</TabsTrigger>
          <TabsTrigger value="throw">成形</TabsTrigger>
          <TabsTrigger value="fire">焼成</TabsTrigger>
        </TabsList>
        <TabsContent value="clay">
          <Body>菊練りで土の中の空気を抜く。練りが足りないと、焼成中に器が割れる。</Body>
        </TabsContent>
        <TabsContent value="throw">
          <Body>轆轤の中心に土を据え、両手で挟んで立ち上げる。</Body>
        </TabsContent>
        <TabsContent value="fire">
          <Body>素焼きは 800℃、本焼きは 1230℃ 前後。</Body>
        </TabsContent>
      </Tabs>

      <Entry name="TextArea" jp="原稿用紙" />
      <Fields wide>
        <Field>
          <FieldLabel htmlFor="c-ta">申 し 送 り</FieldLabel>
          <TextArea id="c-ta" rows={4} placeholder="轆轤の癖、土の産地、次の窯への覚え書き" />
        </Field>
      </Fields>

      <Entry name="Toast" jp="知らせ" />
      <Row>
        <Button variant="contour" onClick={() => toast('下書きを保存しました')}>
          知らせる
        </Button>
        <Button variant="contour" onClick={() => toast.success('窯出しを記録しました')}>
          済んだ
        </Button>
        <Button variant="contour" onClick={() => toast.error('写真を送れませんでした')}>
          失敗
        </Button>
      </Row>
      <Toaster />

      <Entry name="Toggle" jp="押し込む" />
      <Row>
        <Toggle aria-label="太字" size="icon">
          <Bold />
        </Toggle>
        <Toggle variant="contour" defaultPressed>
          下書きを残す
        </Toggle>
        <Toggle variant="contour">写しを取る</Toggle>
        <ToggleGroup type="single" variant="contour" size="sm" defaultValue="月" aria-label="期間">
          {['日', '週', '月', '年'].map((t) => (
            <ToggleGroupItem key={t} value={t}>
              {t}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </Row>

      <Reseed />
    </>
  ),
}
