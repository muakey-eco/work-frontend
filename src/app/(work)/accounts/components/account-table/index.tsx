'use client'

import AccountModalForm from '@/components/AccountModalForm'
import { useAsyncEffect } from '@/libs/hook'
import { randomColor } from '@/libs/utils'
import { EditOutlined, LockOutlined } from '@ant-design/icons'
import { App, Avatar, Badge, Table, TableProps } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useContext, useState } from 'react'
import { AccountPageContext } from '../AccountPageProvider'
import { disableAccountAction, getAccountsRequest } from '../action'

export type AccountTableProps = TableProps & {}

const generateRole = (role: string) => {
  switch (role) {
    case 'Quản trị cấp cao':
      return (
        <Badge
          color="#F5222D"
          text={<span className="font-[500] text-[#F5222D]">{role}</span>}
        />
      )
    case 'Quản trị':
      return (
        <Badge
          color="#FAAD14"
          text={<span className="font-[500] text-[#FAAD14]">{role}</span>}
        />
      )
    case 'Thành viên thông thường':
      return (
        <Badge
          color="#389E0D"
          text={<span className="font-[500] text-[#389E0D]">{role}</span>}
        />
      )
    default:
      return (
        <Badge
          status="default"
          text={<span className="font-[500]">{role}</span>}
        />
      )
  }
}

const AccountTable: React.FC<AccountTableProps> = ({
  dataSource: externalDataSource,
  ...props
}) => {
  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<any>(externalDataSource || [])
  const { roleId } = useContext(AccountPageContext)

  const { modal, message } = App.useApp()
  const router = useRouter()

  const handleLockAccount = async (id: number) => {
    try {
      const { message: msg, errors } = await disableAccountAction(id)

      if (errors) {
        message.error(msg)
        return
      }

      message.success('Tài khoản đã được vô hiệu hóa')
      router.refresh()
    } catch (error) {
      throw new Error(String(error))
    }
  }

  const columns: TableProps['columns'] = [
    {
      title: 'Tài khoản',
      dataIndex: 'username',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'full_name',
      render: (text: string, record: any) => (
        <div className="flex items-center gap-[8px]">
          <Avatar
            src={record?.avatar}
            style={{ backgroundColor: randomColor(String(text)) }}
            alt={String(text)}
          >
            {String(text).charAt(0).toUpperCase()}
          </Avatar>
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phân quyền',
      dataIndex: 'role',
      render: (text: string) => generateRole(text),
    },
    {
      title: 'Chức danh',
      dataIndex: 'position',
      render: (text: string) => text || '--',
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      render: (text: string) => text || '--',
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: (_, record) => (
        <div className="flex items-center gap-[8px]">
          <AccountModalForm initialValues={record} mode="edit">
            <EditOutlined className="!text-[#1677ff]" />
          </AccountModalForm>
          {record?.role !== 'Vô hiệu hoá' && (
            <LockOutlined
              className="cursor-pointer !text-[#CF1322]"
              onClick={() => {
                modal.confirm({
                  title: 'Vô hiệu hóa tài khoản?',
                  okText: 'Xác nhận',
                  cancelText: 'Hủy',
                  content:
                    'Tài khoản này sẽ không thể truy cập vào website, bạn có chắc chắn muốn vô hiệu hoá tài khoản không?',
                  onOk: () => handleLockAccount(record.id),
                  width: 455,
                })
              }}
            />
          )}
        </div>
      ),
    },
  ]

  useAsyncEffect(async () => {
    if (!roleId) return

    setLoading(true)

    if (typeof roleId === 'number') {
      var accounts = await getAccountsRequest({
        include: 'list',
        role_id: roleId,
      })
    } else {
      var accounts: any = externalDataSource?.filter((acc: any) =>
        roleId === 'disabled' ? acc.role === 'Vô hiệu hoá' : true,
      )
    }

    setDataSource(accounts)
    setLoading(false)
  }, [roleId])

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      {...props}
    />
  )
}

export default AccountTable
