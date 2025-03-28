'use client'

import { randomColor } from '@/libs/utils'
import { DownOutlined } from '@ant-design/icons'
import { App, Avatar, Button, Dropdown } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'
import { deleteWorkflowCategoryByIdAction } from '../../action'
import WorkflowCardList from '../workflow-card-list'
import WorkflowExtra from '../workflow-extra'
import WorkFlowDeleteButton from './WorkFlowDeleteButton'
import WorkflowModalForm from './WorkflowModalForm'

type WorkflowItemProps = {
  cate?: any
  options?: any
}

const WorkflowItem: React.FC<WorkflowItemProps> = ({ cate, options }) => {
  const { cateIds, departments, user } = options

  const [expand, setExpand] = useState(true)
  const [ids, setIds] = useState(cateIds || [])
  const { message } = App.useApp()

  const handleDelete = async (id: number) => {
    try {
      await deleteWorkflowCategoryByIdAction(id)

      message.success('Xóa thành công.')
    } catch (error: any) {
      throw new Error(error)
    }
  }

  return (
    <>
      <div className="flex cursor-pointer items-center justify-between gap-[24px] py-[16px]">
        <div
          className="flex items-center gap-[12px]"
          onClick={() => {
            setExpand(!expand)
            setIds((prev: any) => {
              if (prev.includes(cate.id)) {
                return prev?.filter((i: any) => i !== cate.id)
              }

              return [...prev, cate.id]
            })
          }}
        >
          <DownOutlined
            className={clsx(
              'text-[16px]! text-[#000]!',
              !ids.includes(cate.id) && '-rotate-90',
            )}
          />
          <Avatar
            className="rounded-full! text-[16px]!"
            size={36}
            shape="circle"
            style={{ backgroundColor: randomColor(String(cate.label)) }}
          >
            {String(cate.label).charAt(0).toLocaleUpperCase()}
          </Avatar>
          <span className="text-[18px] leading-[42px] font-[400] text-[#000]">
            {cate.label} ({cate.workflows.length})
          </span>
        </div>
        <Dropdown
          rootClassName="z-50!"
          trigger={['click']}
          dropdownRender={() => (
            <div className="overflow-hidden rounded-[6px] bg-[#fff] p-[2px] shadow-[0_2px_6px_0_rgba(0,0,0,0.1)]">
              <div className="cursor-pointer rounded-[4px] bg-[#fff] px-[16px] py-[12px] leading-none transition-all hover:bg-[#0000000a]">
                <WorkflowModalForm
                  initialValues={{
                    workflow_category_id: cate.id,
                    members: cate.members,
                    departments: options?.departments,
                  }}
                />
              </div>
              <WorkflowExtra
                action="edit"
                initialValues={{
                  cate: {
                    ...cate,
                    name: cate.label,
                  },
                  user,
                }}
              >
                <div className="cursor-pointer rounded-[4px] bg-[#fff] px-[16px] py-[12px] leading-none transition-all hover:bg-[#0000000a]">
                  Sửa danh mục
                </div>
              </WorkflowExtra>
              <div className="cursor-pointer rounded-[4px] bg-[#fff] px-[16px] py-[12px] leading-none transition-all hover:bg-[#0000000a]">
                <WorkFlowDeleteButton onDelete={() => handleDelete(cate.id)} />
              </div>
            </div>
          )}
        >
          <Button icon={<DownOutlined />} />
        </Dropdown>
      </div>
      {ids.includes(cate.id) && (
        <WorkflowCardList
          items={cate?.workflows}
          options={{
            members: cate.members,
            departments,
          }}
        />
      )}
    </>
  )
}

export default WorkflowItem
