'use client'

import { randomColor } from '@/libs/utils'
import { PlusOutlined } from '@ant-design/icons'
import { Avatar, Button, Tooltip } from 'antd'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import React, { createContext, useState } from 'react'
import PageHeader from '../../components/PageHeader'
import WorkflowTabs from '../../components/WorkflowTabs'
import StageModalForm from './stage/StageModalForm'
import TaskModalForm from './task/TaskModalForm'
import WorkflowContent from './WorkflowContent'

const WorkflowModalForm = dynamic(
  () => import('../../components/workflow-list/WorkflowModalForm'),
  {
    ssr: false,
  },
)

type WorkflowPageLayoutProps = {
  workflow?: any
  type?: string
  children?: React.ReactNode
  options?: any
  workflowCategories?: any
}

export const StageContext = createContext<any>([])

const WorkflowPageLayout: React.FC<WorkflowPageLayoutProps> = ({
  workflow,
  type,
  options,
  workflowCategories,
}) => {
  const [stages, setStages] = useState<any>(
    options?.stages
      ? Array.from(options?.stages)?.map((stage: any) => ({
          ...stage,
          id: `stage_${stage.id}`,
        }))
      : [],
  )

  const workflowsForProcess = Array.from(workflowCategories)?.filter(
    (w: any) => w?.id === workflow?.workflow_category_id,
  )

  const isAuth =
    workflow?.members?.map((mem: any) => mem?.id).includes(options?.user.id) ||
    options?.user?.role === 'Admin'

  const { date, tag, user, customFields } = options

  return (
    <StageContext.Provider value={{ stages, setStages, isAuth }}>
      <div className="flex h-full flex-col">
        <PageHeader
          className="h-[82px] bg-[#fff]"
          title={
            <div className="flex items-center gap-[8px] text-[24px] leading-[28px] font-[600]">
              <span>{workflow?.name}</span>
              <WorkflowModalForm
                action="edit"
                initialValues={{
                  ...workflow,
                  manager: workflow?.members
                    ?.map((m: any) => m?.username)
                    .join(' '),
                  ...options,
                }}
              >
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
              </WorkflowModalForm>
            </div>
          }
          extra={
            <div className="flex items-center gap-[8px]">
              <TaskModalForm
                initialValues={{
                  members: workflow?.members,
                  customFields,
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
                key: 'custom-fields',
                label: 'Trường tùy chỉnh',
              },
              {
                key: 'docs',
                label: 'Báo cáo',
              },
              // {
              //   key: 'report-field',
              //   label: 'Trường báo cáo',
              // },
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
              workflowsForProcess,
              customFields,
            }}
          />
        </div>
      </div>
    </StageContext.Provider>
  )
}

export default WorkflowPageLayout
