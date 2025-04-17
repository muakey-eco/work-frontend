'use client'

import { randomColor } from '@/libs/utils'
import { PlusOutlined } from '@ant-design/icons'
import { Avatar, Button, Tooltip } from 'antd'
import clsx from 'clsx'
import React, { createContext, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import WorkflowTabs from '../../components/WorkflowTabs'
import StageModalForm from './stage/StageModalForm'
import TaskModalForm from './task/TaskModalForm'
import WorkflowContent from './WorkflowContent'

type WorkflowPageLayoutProps = {
  workflow?: any
  type?: string
  children?: React.ReactNode
  options?: any
}

export const StageContext = createContext<any>([])

const WorkflowPageLayout: React.FC<WorkflowPageLayoutProps> = ({
  workflow,
  type,
  options,
}) => {
  const [stages, setStages] = useState<any>(
    options?.stages
      ? options?.stages?.map((stage: any) => ({
          ...stage,
          id: `stage_${stage.id}`,
        }))
      : [],
  )

  const isAuth =
    workflow?.members?.map((mem: any) => mem?.id).includes(options?.user.id) ||
    options?.user?.role === 'Quản trị cấp cao'

  const { date, tag, user } = options

  return (
    <StageContext.Provider value={{ stages, setStages, isAuth }}>
      <div className="flex h-full flex-col">
        <PageHeader
          className="h-[82px] bg-[#fff]"
          title={
            <div className="flex items-center gap-[8px] text-[24px] leading-[28px] font-[600]">
              <span>{workflow?.name}</span>
              <Avatar.Group
                className="h-[32px] overflow-hidden"
                max={{
                  count: 3,
                  style: {
                    backgroundColor: '#fde3cf',
                    color: '#f56a00',
                  },
                }}
              >
                {workflow?.members &&
                  workflow?.members?.map((mem: any) => (
                    <Tooltip key={mem?.id} title={mem?.full_name}>
                      <Avatar
                        className="size-[32px] cursor-pointer overflow-hidden"
                        key={mem?.username}
                        src={mem?.avatar}
                        style={{
                          backgroundColor: randomColor(mem?.full_name || ''),
                        }}
                      >
                        {String(mem?.full_name).charAt(0).toLocaleUpperCase()}
                      </Avatar>
                    </Tooltip>
                  ))}
              </Avatar.Group>
            </div>
          }
          extra={
            <div className="flex items-center gap-[8px]">
              <TaskModalForm
                initialValues={{
                  members: workflow?.members,
                }}
              >
                <Button
                  className="p-[10px]! text-[12px]! text-[#fff]"
                  icon={<PlusOutlined className="text-[16px]" />}
                  type="primary"
                >
                  Tạo nhiệm vụ
                </Button>
              </TaskModalForm>
              <StageModalForm
                initialValues={{
                  workflow_id: workflow?.id,
                }}
              >
                <Button
                  className="p-[10px]! text-[12px]! text-[#fff]"
                  icon={<PlusOutlined className="text-[16px]" />}
                  type="primary"
                >
                  Thêm giai đoạn
                </Button>
              </StageModalForm>
            </div>
          }
        >
          <WorkflowTabs
            className="mt-[12px]"
            activeKey={type}
            items={[
              {
                key: 'table',
                label: 'Dạng bảng',
              },
              {
                key: 'statistics',
                label: 'Thống kê',
              },
              {
                key: 'docs',
                label: 'Báo cáo',
              },
              {
                key: 'report-field',
                label: 'Trường báo cáo',
              },
            ]}
          />
        </PageHeader>
        <div
          className={clsx(!type || type !== 'table') || 'flex-1 overflow-auto'}
        >
          <WorkflowContent
            options={{
              type,
              workflow,
              stages,
              date,
              tag,
              user,
            }}
          />
        </div>
      </div>
    </StageContext.Provider>
  )
}

export default WorkflowPageLayout
