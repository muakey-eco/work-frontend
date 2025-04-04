import { getAttendances, getMe } from '@/libs/data'
import { getProposeCategories, getProposes } from '@/libs/propose'
import { Button } from 'antd'
import React from 'react'
import RequestModalForm from '../../../components/RequestModalForm'
import PageHeader from './components/PageHeader'
import RequestTabs from './components/request-tabs'
import RequestTable from './components/RequestTable'

const Page: React.FC<any> = async (prop: { searchParams?: any }) => {
  const searchParams = await prop.searchParams

  const [attendances, proposes, proposeCategories, user] = await Promise.all([
    getAttendances(),
    getProposes(),
    getProposeCategories(),
    getMe(),
  ])

  return (
    <div className="h-[100vh] bg-[#f6f6f6]">
      <PageHeader
        className="h-[85px] bg-[#fff]"
        title={
          <h1 className="text-[24px] leading-[28px] font-[600]">
            Danh sách yêu cầu
          </h1>
        }
        extra={
          <RequestModalForm
            groups={proposeCategories}
            options={{ user, attendances: attendances.attendances }}
          >
            <Button type="primary">Tạo yêu cầu</Button>
          </RequestModalForm>
        }
      >
        <RequestTabs
          className="mt-[12px]"
          activeKey={searchParams?.status || 'all'}
          items={[
            {
              key: 'all',
              label: 'Tất cả yêu cầu',
            },
            {
              key: 'pending',
              label: 'Đang chờ duyệt',
            },
            {
              key: 'approved',
              label: 'Đã duyệt',
            },
            {
              key: 'canceled',
              label: 'Từ chối',
            },
          ]}
        />
      </PageHeader>

      <div className="h-[calc(100vh-82px)] overflow-auto p-[16px]">
        <RequestTable
          dataSource={proposes}
          query={{
            status:
              searchParams?.status !== 'all' ? searchParams?.status || '' : '',
          }}
          options={{
            user,
          }}
        />
      </div>
    </div>
  )
}

export default Page
