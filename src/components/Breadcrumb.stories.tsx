import type { Meta, StoryObj } from '@storybook/react-vite'
import { Cap } from '../stories/layout'
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from './Breadcrumb'

const meta: Meta<typeof Breadcrumb> = { title: '手触り / Breadcrumb', component: Breadcrumb }
export default meta
type Story = StoryObj<typeof Breadcrumb>

export const Playground: Story = {
  name: '道しるべ',
  render: () => (
    <>
      <Cap>道 し る べ — 区 切 り は 筆 の 返 し</Cap>
      <Breadcrumb className="mb-14">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#b">工房</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="#b">作品</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>粉引の湯呑</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </>
  ),
}
