'use client'

import { randomColor } from '@/libs/utils'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import { App, Avatar, Table, TableProps } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import AccountModalForm from '../account-actions/AccountModalForm'
import { deleteAccountAction } from '../account-actions/action'

type AccountTableProps = TableProps & {
  options?: any
}

const AccountTable: React.FC<AccountTableProps> = ({
  options,
  ...restProps
}) => {
  const [open, setOpen] = useState(false)
  const { modal, message } = App.useApp()
  const router = useRouter()

  const { roles } = options

  const handleDelete = async (id: number) => {
    try {
      const { message: msg, errors } = await deleteAccountAction(id)

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

  const columns: TableProps['columns'] = [
    {
      title: 'STT',
      dataIndex: 'count',
      render: (_, __, index) => index + 1,
    },
    {
      title: 'Tên người dùng',
      dataIndex: 'full_name',
      render: (_, record) => {
        return (
          <div className="flex items-center gap-[8px]">
            <Avatar
              src={record?.avatar}
              style={{
                backgroundColor: randomColor(String(record?.full_name)),
              }}
            >
              {String(record?.full_name).charAt(0).toUpperCase()}
            </Avatar>
            <span>{String(record?.full_name)}</span>
          </div>
        )
      },
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phân quyền',
      dataIndex: 'role_id',
      render: (value) => {
        const role = roles?.find((r: any) => r?.id === value)

        return role ? role?.name : 'Người dùng'
      },
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
    },
    {
      title: 'Vị trí',
      dataIndex: 'position',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: (_, record) => (
        <div className="flex items-center gap-[8px]">
          <AccountModalForm action="edit" initialValues={{ ...record }}>
            <EditOutlined className="text-[#1677ff]" />
          </AccountModalForm>
          <DeleteOutlined
            className="text-[#cf1322]"
            onClick={() => {
              modal.confirm({
                title: 'Xác nhận xóa tài khoản này?',
                onOk: () => handleDelete(record?.id),
                open,
                onCancel: () => setOpen(false),
              })
            }}
          />
        </div>
      ),
    },
  ]

  return (
    <div className="h-[calc(100vh-166px)] overflow-hidden rounded-[16px] bg-[#fff] p-[24px]">
      <h2 className="text-[22px] leading-[28px] font-[500]">
        Danh sách tài khoản
      </h2>

      <div className="mt-[24px]">
        <Table
          columns={columns}
          pagination={{
            pageSize: 8,
          }}
          {...restProps}
        />
      </div>
    </div>
  )
}

export default AccountTable
