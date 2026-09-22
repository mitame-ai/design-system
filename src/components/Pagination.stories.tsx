import type { Meta, StoryObj } from '@storybook/react-vite'
import { useState } from 'react'
import { Cap } from '../stories/layout'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from './Pagination'

const meta: Meta<typeof Pagination> = { title: '手触り / Pagination', component: Pagination }
export default meta
type Story = StoryObj<typeof Pagination>

function Pager() {
  const [page, setPage] = useState(2)
  const go = (p: number) => (e: React.MouseEvent) => {
    e.preventDefault()
    setPage(Math.min(9, Math.max(1, p)))
  }
  return (
    <Pagination className="mb-14">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#p" onClick={go(page - 1)} />
        </PaginationItem>
        {[1, 2, 3].map((n) => (
          <PaginationItem key={n}>
            <PaginationLink href="#p" isActive={page === n} onClick={go(n)}>
              {n}
            </PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#p" isActive={page === 9} onClick={go(9)}>
            9
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#p" onClick={go(page + 1)} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}

export const Playground: Story = {
  name: '頁送り',
  render: () => (
    <>
      <Cap>頁 送 り — 開 い て い る 頁 の 数 字 に 、 そ の 場 で 丸 を 付 け る</Cap>
      <Pager />
    </>
  ),
}
