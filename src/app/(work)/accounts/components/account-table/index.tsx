'use client'

import AccountModalForm from '@/components/AccountModalForm'
import { convertToSlug, randomColor } from '@/libs/utils'
import { EditOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { App, Avatar, Badge, Table, TableProps } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  activeAccountAction,
  disableAccountAction,
  getAccountsRequest,
} from '../action'
import AccountPaginationTable from './AccountPaginationTable'

export type AccountTableProps = TableProps & {
  views: any
}

const generateRole = (role: string) => {
  switch (role) {
    case 'Admin':
      return (
        <Badge
          color="#F5222D"
          text={<span className="font-[500] text-[#F5222D]">{role}</span>}
        />
      )
    case 'Quản lý':
      return (
        <Badge
          color="#FAAD14"
          text={<span className="font-[500] text-[#FAAD14]">{role}</span>}
        />
      )
    case 'Nhân viên':
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

const AccountTable: React.FC<AccountTableProps> = ({ ...props }) => {
  const { modal, message } = App.useApp()
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = new URLSearchParams(searchParams)
  const search = query.get('search')
  const view = query.get('view')
  const quit_work = query.get('quit_work')
  const page = Number(query.get('page'))

  const [loading, setLoading] = useState(false)
  const [dataSource, setDataSource] = useState<any>([])
  const refpagination = useRef({
    current: Number(page) || 1,
    pageSize: 10,
    total: 0,
  })

  const role_id = props.views.find(
    (value: any) => convertToSlug(value.name) === view,
  )?.id

  const handleLockAccount = async (id: number) => {
    try {
      setLoading(true)
      const { message: msg, errors } = await disableAccountAction(id)

      if (errors) {
        message.error(msg)
        return
      }

      message.success('Tài khoản đã được vô hiệu hóa')
      // Fetch fresh data
      const { current, pageSize } = refpagination.current
      await fetchData(current, pageSize)
      router.refresh()
      // Dispatch event to update header
      window.dispatchEvent(new Event('accountStatusChanged'))
    } catch (error) {
      message.error('Có lỗi xảy ra khi vô hiệu hóa tài khoản')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleUnlockAccount = async (id: number) => {
    try {
      setLoading(true)
      const { message: msg, errors } = await activeAccountAction(id)

      if (errors) {
        message.error(msg)
        return
      }

      message.success('Tài khoản đã được kích hoạt')
      // Fetch fresh data
      const { current, pageSize } = refpagination.current
      await fetchData(current, pageSize)
      router.refresh()
      // Dispatch event to update header
      window.dispatchEvent(new Event('accountStatusChanged'))
    } catch (error) {
      message.error('Có lỗi xảy ra khi kích hoạt tài khoản')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const columns: TableProps['columns'] = [
    {
      title: 'Tài khoản',
      dataIndex: 'username',
      sorter: (a, b) => a.username.localeCompare(b.username),
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
            className="shrink-0"
          >
            {String(text).charAt(0).toUpperCase()}
          </Avatar>
          <span>{text}</span>
        </div>
      ),
      sorter: (a, b) => a.full_name.localeCompare(b.full_name),
      filterMode: 'tree',
      filterSearch: true,
      onFilter: (value, record) => record.full_name.includes(value as string),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Phân quyền',
      dataIndex: 'role',
      render: (text: string) => generateRole(text),
      sorter: (a, b) => a.role.localeCompare(b.role),
    },
    {
      title: 'Chức danh',
      dataIndex: 'position',
      render: (text: string) => text || '--',
      sorter: (a, b) => {
        const posA = a.position || ''
        const posB = b.position || ''
        return posA.localeCompare(posB)
      },
    },
    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      render: (text: string) => text || '--',
      sorter: (a, b) => {
        const phoneA = a.phone || ''
        const phoneB = b.phone || ''
        return phoneA.localeCompare(phoneB)
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: (_, record) => (
        <div className="flex items-center gap-[24px]">
          {record?.role !== 'Vô hiệu hoá' && (
            <>
              <AccountModalForm initialValues={record} mode="edit">
                <EditOutlined className="!text-[#1677ff]" />
              </AccountModalForm>
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
            </>
          )}
          {record?.role === 'Vô hiệu hoá' && (
            <UnlockOutlined
              className="cursor-pointer !text-[#389E0D]"
              onClick={() => {
                modal.confirm({
                  title: 'Kích hoạt tài khoản?',
                  okText: 'Xác nhận',
                  cancelText: 'Hủy',
                  content:
                    'Tài khoản này sẽ được kích hoạt và có thể truy cập vào website, bạn có chắc chắn muốn kích hoạt tài khoản không?',
                  onOk: () => handleUnlockAccount(record.id),
                  width: 455,
                })
              }}
            />
          )}
        </div>
      ),
    },
  ]

  const fetchData = useCallback(
    async (page: number, pageSize: number) => {
      setLoading(true)

      try {
        query.set('include', 'list')
        query.set('page', page.toString())
        query.set('per_page', pageSize.toString())
        query.set('search', search || '')
        query.set('view', view || '')
        query.set('role_id', (role_id === 'disabled' ? '' : role_id) || '')
        query.set('quit_work', quit_work || '')
        const response = await getAccountsRequest(query)

        const { data, current_page, per_page, total } = response
        setDataSource(data)
        refpagination.current = {
          current: current_page,
          pageSize: per_page,
          total,
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false)
      }
    },
    [search, role_id, quit_work, page],
  )

  const handleTableChange = (pagination: any) => {
    if (page) {
      refpagination.current.current = 1
    }
    const { current, pageSize } = pagination
    query.set('page', current.toString())
    router.push(`?${query.toString()}`)
    fetchData(current, pageSize)
  }

  useEffect(() => {
    if (!page) {
      refpagination.current.current = 1
    }
    const { current, pageSize } = refpagination.current
    fetchData(current, pageSize)

    // Add event listener for table refresh
    const handleTableChange = () => {
      const { current, pageSize } = refpagination.current
      fetchData(current, pageSize)
    }

    window.addEventListener('accountTableChanged', handleTableChange)
    return () => {
      window.removeEventListener('accountTableChanged', handleTableChange)
    }
  }, [refpagination, fetchData, page, search])

  return (
    <div className="overflow-x-auto">
      <Table
        columns={columns}
        dataSource={dataSource}
        loading={loading}
        pagination={false}
        scroll={{ y: 'calc(100vh - 230px)' }}
        rowKey={(record) => record.id}
        {...props}
      />
      <AccountPaginationTable
        current={refpagination.current.current}
        pageSize={refpagination.current.pageSize}
        total={refpagination.current.total}
        onChange={handleTableChange}
      />
    </div>
  )
}

export default AccountTable
