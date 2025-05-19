import { getWorkflowCategories } from '@/libs/data'
import { getDepartments } from '@/libs/department'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import React from 'react'
import PageHeader from './components/PageHeader'
import PageProvider from './components/PageProvider'
import WorkflowExtra from './components/workflow-extra'
import WorkflowList from './components/workflow-list'
import WorkflowSearch from './components/WorkflowSearch'
import WorkflowTabs from './components/WorkflowTabs'

const page: React.FC<any> = async (prop: { searchParams?: any }) => {
  const searchParams = await prop.searchParams
  const type = searchParams?.type

  const [workflowCategories, departments] = await Promise.all([
    getWorkflowCategories(),
    getDepartments(),
  ])
  console.log('workflowCategories', workflowCategories)
  return (
    <PageProvider>
      <div className="flex h-full flex-col">
        <PageHeader
          className="h-[85px] bg-[#fff]"
          title={
            <h1 className="text-[24px] leading-[28px] font-[600]">Quy trình</h1>
          }
          extra={
            <div className="flex items-center gap-[12px]">
              <WorkflowSearch className="flex-1" />
              <WorkflowExtra
                initialValues={{
                  workflowCategories,
                  departments,
                }}
              >
                <Button
                  className="w-[150px] p-[10px]! text-[12px]! text-[#fff]"
                  icon={<PlusOutlined className="text-[16px]" />}
                  type="primary"
                >
                  Tạo mới danh mục
                </Button>
              </WorkflowExtra>
            </div>
          }
        >
          <WorkflowTabs
            className="mt-[12px]"
            activeKey={type || 'open'}
            items={[
              {
                key: 'open',
                label: 'Đang khả dụng',
              },
              {
                key: 'close',
                label: 'Đã đóng',
              },
              {
                key: 'all',
                label: 'Tất cả workflows',
              },
            ]}
          />
        </PageHeader>
        <div className="flex-1 overflow-auto bg-[#eee] px-[24px] py-[8px]">
          <WorkflowList
            query={{
              type,
              searchParams,
              departments,
              workflowCategories,
            }}
            suspense
          />
        </div>
      </div>
    </PageProvider>
  )
}

export default page
