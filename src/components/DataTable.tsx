import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Glyph } from '../lib/marks'
import { cn } from '../lib/utils'
import { Button } from './Button'
import { Checkbox } from './Checkbox'
import { InputGroup, InputGroupAddon, InputGroupInput } from './InputGroup'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './Table'

export interface DataTableColumn<T> {
  /** 列の識別子。並べ替えと絞り込みの鍵にも使う */
  id: string
  header: ReactNode
  /** 列の値。並べ替えと絞り込みに使う。省略時は row[id] */
  accessor?: (row: T) => string | number | null | undefined
  /** セルの中身。省略時は accessor の値をそのまま書く */
  cell?: (row: T) => ReactNode
  sortable?: boolean
  align?: 'start' | 'end'
  className?: string
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[]
  data: T[]
  getRowId?: (row: T, index: number) => string
  /** 絞り込みの入力欄を出す。文字列は placeholder になる */
  filter?: boolean | string
  /** 1 頁の行数。0 で頁を分けない */
  pageSize?: number
  /** 行の頭にチェックを置き、選べるようにする */
  selectable?: boolean
  onSelectionChange?: (ids: string[]) => void
  empty?: ReactNode
  className?: string
  /** 絞り込み欄の右に並べる道具（列の表示切り替えなど） */
  toolbar?: ReactNode
}

type Sort = { id: string; desc: boolean } | null

const readCell = <T,>(col: DataTableColumn<T>, row: T) =>
  col.accessor
    ? col.accessor(row)
    : ((row as Record<string, unknown>)[col.id] as string | number | undefined)

/**
 * 帳面 — Table の上に、並べ替え・絞り込み・頁送り・行の選択を載せたもの。
 * 見出しを押すと並びが変わり、返しの向きで昇順か降順かを示す。
 */
export function DataTable<T>({
  columns,
  data,
  getRowId = (_, i) => String(i),
  filter = false,
  pageSize = 10,
  selectable = false,
  onSelectionChange,
  empty = '該当する行はありません',
  className,
  toolbar,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<Sort>(null)
  const [page, setPage] = useState(0)
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const rows = useMemo(
    () => data.map((row, i) => ({ row, id: getRowId(row, i) })),
    [data, getRowId],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return rows
    return rows.filter(({ row }) =>
      columns.some((c) =>
        String(readCell(c, row) ?? '')
          .toLowerCase()
          .includes(q),
      ),
    )
  }, [rows, columns, query])

  const sorted = useMemo(() => {
    if (!sort) return filtered
    const col = columns.find((c) => c.id === sort.id)
    if (!col) return filtered
    const out = [...filtered].sort((a, b) => {
      const x = readCell(col, a.row)
      const y = readCell(col, b.row)
      if (x == null) return 1
      if (y == null) return -1
      return typeof x === 'number' && typeof y === 'number'
        ? x - y
        : String(x).localeCompare(String(y), 'ja')
    })
    return sort.desc ? out.reverse() : out
  }, [filtered, columns, sort])

  const pages = pageSize > 0 ? Math.max(1, Math.ceil(sorted.length / pageSize)) : 1
  const current = Math.min(page, pages - 1)
  const visible = pageSize > 0 ? sorted.slice(current * pageSize, (current + 1) * pageSize) : sorted

  useEffect(() => {
    onSelectionChange?.([...selected])
  }, [selected, onSelectionChange])

  const allOnPage = visible.length > 0 && visible.every((r) => selected.has(r.id))
  const someOnPage = visible.some((r) => selected.has(r.id))

  const toggleAll = (on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev)
      for (const r of visible) on ? next.add(r.id) : next.delete(r.id)
      return next
    })
  const toggle = (id: string, on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev)
      on ? next.add(id) : next.delete(id)
      return next
    })

  const cycleSort = (id: string) => {
    setSort((s) => (s?.id !== id ? { id, desc: false } : s.desc ? null : { id, desc: true }))
    setPage(0)
  }

  return (
    <div className={cn('tz-datatable', className)}>
      {(filter || toolbar) && (
        <div className="tz-datatable__bar">
          {filter && (
            <InputGroup variant="rule" className="tz-datatable__filter">
              <InputGroupAddon>
                <Glyph name="search" />
              </InputGroupAddon>
              <InputGroupInput
                value={query}
                placeholder={typeof filter === 'string' ? filter : '絞り込む'}
                aria-label="絞り込む"
                onChange={(e) => {
                  setQuery(e.target.value)
                  setPage(0)
                }}
              />
            </InputGroup>
          )}
          {toolbar}
        </div>
      )}
      <Table>
        <TableHeader>
          <TableRow>
            {selectable && (
              <TableHead className="tz-datatable__pick">
                <Checkbox
                  aria-label="この頁の行をすべて選ぶ"
                  checked={allOnPage ? true : someOnPage ? 'indeterminate' : false}
                  onCheckedChange={(v) => toggleAll(v === true)}
                />
              </TableHead>
            )}
            {columns.map((c) => {
              const dir = sort?.id === c.id ? (sort.desc ? 'descending' : 'ascending') : undefined
              return (
                <TableHead
                  key={c.id}
                  aria-sort={c.sortable ? (dir ?? 'none') : undefined}
                  className={cn(c.align === 'end' && 'is-end', c.className)}
                >
                  {c.sortable ? (
                    <button
                      type="button"
                      className="tz-datatable__sort"
                      onClick={() => cycleSort(c.id)}
                    >
                      {c.header}
                      <Glyph
                        name={dir === 'descending' ? 'turn' : 'up'}
                        className={cn('tz-datatable__turn', dir && 'is-on')}
                      />
                    </button>
                  ) : (
                    c.header
                  )}
                </TableHead>
              )
            })}
          </TableRow>
        </TableHeader>
        <TableBody>
          {visible.length ? (
            visible.map(({ row, id }) => (
              <TableRow key={id} data-state={selected.has(id) ? 'selected' : undefined}>
                {selectable && (
                  <TableCell className="tz-datatable__pick">
                    <Checkbox
                      aria-label="この行を選ぶ"
                      checked={selected.has(id)}
                      onCheckedChange={(v) => toggle(id, v === true)}
                    />
                  </TableCell>
                )}
                {columns.map((c) => (
                  <TableCell key={c.id} className={cn(c.align === 'end' && 'is-end', c.className)}>
                    {c.cell ? c.cell(row) : (readCell(c, row) ?? '')}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="tz-datatable__empty"
              >
                {empty}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="tz-datatable__foot">
        <span className="tz-datatable__count">
          {selectable
            ? `${sorted.length} 行のうち ${selected.size} 行を選択`
            : `${sorted.length} 行`}
        </span>
        {pageSize > 0 && pages > 1 && (
          <div className="tz-datatable__pager">
            <span className="tz-datatable__page">
              {current + 1} / {pages} 頁
            </span>
            <Button
              variant="contour"
              size="sm"
              disabled={current === 0}
              onClick={() => setPage(current - 1)}
            >
              前へ
            </Button>
            <Button
              variant="contour"
              size="sm"
              disabled={current >= pages - 1}
              onClick={() => setPage(current + 1)}
            >
              次へ
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
