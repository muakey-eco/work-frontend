'use client'

import { randomColor } from '@/libs/utils'
import { App, Avatar, Dropdown, Tooltip } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'
import { deleteDepartmentAction } from '../department-list/action'
import DepartmentModalForm from '../DepartmentModalForm'

type DepartmentItemProps = {
  item?: any
  options?: any
}

const DepartmentItem: React.FC<DepartmentItemProps> = ({ item, options }) => {
  const { message, modal } = App.useApp()
  const router = useRouter()

  const members = options?.accounts?.filter(
    (acc: any) => acc?.type !== 'department',
  )

  const handleDelete = async (id: number) => {
    try {
      const { message: msg, errors } = await deleteDepartmentAction(id)

      if (errors) {
        message.error(msg)
        return
      }

      message.success('Xóa thành công')
      router.refresh()
    } catch (error) {
      throw new Error(String(error))
    }
  }

  return (
    <div className="h-auto w-full space-y-[16px] overflow-hidden rounded-[4px] bg-[#fff] p-[16px]">
      <div className="flex items-center justify-between gap-[16px] leading-none">
        <span className="line-clamp-1 text-[16px]">{item?.name}</span>
        <Dropdown
          rootClassName="z-50!"
          trigger={['click']}
          dropdownRender={() => (
            <div className="mt-[4px] rounded-[4px] bg-[#fff] p-[2px] shadow-[0_2px_6px_0_rgba(0,0,0,0.1)]">
              <DepartmentModalForm
                action="edit"
                options={{
                  id: item?.id,
                  members,
                  initialValues: {
                    name: item?.name,
                    members: item?.members?.map((mem: any) => mem?.username),
                  },
                }}
              >
                <div className="cursor-pointer bg-transparent px-[16px] py-[12px] text-[14px] leading-none transition-all hover:bg-[#f8f8f8]">
                  Chỉnh sửa phòng ban
                </div>
              </DepartmentModalForm>
              <div
                className="cursor-pointer bg-transparent px-[16px] py-[12px] text-[14px] leading-none text-[#cc1111] transition-all hover:bg-[#f8f8f8]"
                onClick={() => {
                  modal.confirm({
                    title: 'Xóa phòng ban?',
                    content: 'Xác nhận xóa phòng ban này?',
                    onOk: async () => {
                      await handleDelete(item?.id)
                    },
                    okText: 'Xóa',
                  })
                }}
              >
                Xóa phòng ban
              </div>
            </div>
          )}
        >
          <div className="cursor-pointer px-[6px] py-[2px] text-[20px] text-[#000]">
            ··
          </div>
        </Dropdown>
      </div>
      <Avatar.Group className="max-h-[32px] overflow-hidden">
        {item?.members?.map((member: any) => (
          <Tooltip key={member?.id} title={member?.full_name}>
            <Avatar
              src={member?.avatar}
              style={{
                backgroundColor: randomColor(String(member?.full_name)),
              }}
            >
              {String(member?.full_name).charAt(0).toUpperCase()}
            </Avatar>
          </Tooltip>
        ))}
      </Avatar.Group>
    </div>
  )
}

export default DepartmentItem
