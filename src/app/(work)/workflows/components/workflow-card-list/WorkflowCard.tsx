'use client'

import { randomColor } from '@/libs/utils'
import { Card, Progress } from '@/ui'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { App, Avatar, Dropdown, Tooltip } from 'antd'
import Link from 'next/link'
import React from 'react'
import { deleteWorkflowAction } from '../../action'
import WorkflowModalForm from '../workflow-list/WorkflowModalForm'

type WorkflowCardProps = {
  workflow?: any
  total?: any
  members?: any[]
  options?: any
}

const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  total,
  options,
}) => {
  const completedPercent = (total?.successTask / total?.task) * 100
  const failedPercent = (total?.failedTask / total?.task) * 100
  const { message, modal } = App.useApp()

  const handleDelete = () => {
    modal.confirm({
      title: 'Xác nhận xóa quy trình này',
      icon: <ExclamationCircleOutlined />,
      okText: 'Xác nhận',
      cancelText: 'Bỏ qua',
      onOk: async () => {
        try {
          await deleteWorkflowAction(workflow?.id)

          message.success('Xóa thành công')
          if (typeof window !== 'undefined') {
            window.location.reload()
          }
        } catch (error) {
          throw new Error(String(error))
        }
      },
    })
  }

  return (
    <div className="relative h-auto w-full overflow-hidden">
      <Link href={`/workflows/${workflow.id}`} prefetch={false}>
        <Card className="size-full">
          <div className="text-[16px] leading-[20px]">
            <span className="line-clamp-1 font-[400]">{workflow?.name}</span>
          </div>
          <p className="mt-[8px] min-h-[36px] text-[12px] text-[#999]">
            {workflow?.description || 'Không có mô tả'}
          </p>
          <div className="mt-[16px] space-y-[8px]">
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
                      key={mem?.username}
                      src={mem?.avatar}
                      style={{
                        backgroundColor: randomColor(mem?.full_name || ''),
                        cursor: 'pointer',
                      }}
                      alt={mem?.full_name}
                    >
                      {String(mem?.full_name).charAt(0).toLocaleUpperCase()}
                    </Avatar>
                  </Tooltip>
                ))}
            </Avatar.Group>
            <Progress
              size={8}
              className="w-full"
              color={['#42b814', '#c34343']}
              percent={[completedPercent, failedPercent]}
            />
            <div className="flex items-center justify-between text-[12px]">
              <span>
                {total?.task || 0} <span className="text-[#999]">Nhiệm vụ</span>
              </span>
              <div className="flex items-center gap-[4px]">
                <span>
                  {total?.successTask || 0}{' '}
                  <span className="text-[#999]">Hoàn thành</span>
                </span>
                ·
                <span>
                  {total?.failedTask || 0}{' '}
                  <span className="text-[#999]">Thất bại</span>
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
      <div className="absolute top-[20px] right-[20px]">
        <Dropdown
          rootClassName="z-50!"
          trigger={['click']}
          dropdownRender={() => (
            <div className="mt-[4px] rounded-[4px] bg-[#fff] p-[2px] shadow-[0_2px_6px_0_rgba(0,0,0,0.1)]">
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
                <div className="cursor-pointer bg-transparent px-[16px] py-[12px] text-[14px] leading-none transition-all hover:bg-[#f8f8f8]">
                  Chỉnh sửa quy trình
                </div>
              </WorkflowModalForm>
              <div
                className="cursor-pointer bg-transparent px-[16px] py-[12px] text-[14px] leading-none text-[#cc1111] transition-all hover:bg-[#f8f8f8]"
                onClick={handleDelete}
              >
                Xóa quy trình
              </div>
            </div>
          )}
        >
          <div className="cursor-pointer pl-[8px] text-[20px] leading-none text-[#000]">
            ··
          </div>
        </Dropdown>
      </div>
    </div>
  )
}

export default WorkflowCard
