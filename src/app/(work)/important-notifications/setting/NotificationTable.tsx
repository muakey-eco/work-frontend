'use client'

import {
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleFilled,
  EyeInvisibleOutlined,
} from '@ant-design/icons'
import type { TableColumnsType } from 'antd'
import { App, Button, Spin, Table } from 'antd'
import dayjs from 'dayjs'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import {
  deleteImportantNotificationAction,
  hideImportantNotificationAction,
} from '../action'
import INotificationModalForm from '../components/INotificationModalForm'

interface NotificationItem {
  id: number
  title: string
  message: string
  thumbnail?: string
  updated_at: string
  is_hidden?: boolean
}

interface TableDataItem {
  key: number
  notification: React.ReactNode
  time: string
  action: React.ReactNode
}

const columns: TableColumnsType<TableDataItem> = [
  {
    title: 'Thông báo',
    dataIndex: 'notification',
    width: 676,
  },
  {
    title: 'Thời gian',
    dataIndex: 'time',
    width: 692,
  },
  {
    title: 'Hành động',
    dataIndex: 'action',
    width: 128,
  },
]

type NotificationTableProps = {
  data: {
    data: NotificationItem[]
    total: number
  }
}

const NotificationTable: React.FC<NotificationTableProps> = ({ data }) => {
  const { data: dataChild, ...other } = data
  const { modal, message } = App.useApp()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('search')

  const currentPageSize = Number(searchParams.get('per_page')) || 18
  const currentPage = Number(searchParams.get('page')) || 1

  const handlePaginationChange = (page: number, pageSize: number) => {
    const params = new URLSearchParams()
    params.set('page', page.toString())
    params.set('per_page', pageSize.toString())
    if (searchQuery) {
      params.set('search', searchQuery)
    }
    router.push(`/important-notifications/setting?${params.toString()}`)
  }

  const filteredData = useMemo(() => {
    if (!searchQuery) return dataChild
    return dataChild.filter((item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [dataChild, searchQuery])

  const handleHideNotification = async (id: number) => {
    try {
      setLoading(true)
      await hideImportantNotificationAction(id)
      message.success('Ẩn thông báo thành công')
      router.refresh()
    } catch (error) {
      message.error('Có lỗi xảy ra khi ẩn thông báo')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteNotification = async (id: number) => {
    try {
      setLoading(true)
      await deleteImportantNotificationAction(id)
      message.success('Xóa thông báo thành công')
      router.refresh()
    } catch (error) {
      message.error('Có lỗi xảy ra khi xóa thông báo')
    } finally {
      setLoading(false)
    }
  }

  const dataConfig = filteredData.map((item) => ({
    key: item.id,
    notification: (
      <div className="flex items-center gap-2">
        <img
          src={item?.thumbnail || 'https://picsum.photos/400/300'}
          alt="thumbnail"
          style={{
            minWidth: 88,
            height: 42,
            borderRadius: 8,
          }}
          className="object-cover"
        />

        <div>
          <p className="text-[14px] font-[600]">{item.title}</p>
          <p
            className="line-clamp-1 text-[12px] font-[400] text-gray-500"
            dangerouslySetInnerHTML={{ __html: item.message }}
          />
        </div>
      </div>
    ),
    time: dayjs(item.updated_at).format('HH:mm - DD/MM/YYYY'),
    action: (
      <div className="flex items-center gap-2">
        <INotificationModalForm action="update" data={item}>
          <Button
            type="text"
            className="!text-blue-500"
            icon={<EditOutlined style={{ fontSize: 20 }} />}
          />
        </INotificationModalForm>
        <Button
          type="text"
          className="!text-yellow-500"
          icon={<EyeInvisibleOutlined style={{ fontSize: 20 }} />}
          onClick={() => {
            modal.confirm({
              title: 'Bạn có chắc chắn muốn ẩn thông báo này không?',
              okText: 'Ẩn',
              cancelText: 'Hủy',
              content:
                'User sẽ không thể xem được thông báo này, bạn có chắc chắn muốn ẩn ?',
              onOk: () => {
                handleHideNotification(item.id)
              },
            })
          }}
        />
        <Button
          type="text"
          className="!text-red-500"
          icon={<DeleteOutlined style={{ fontSize: 20 }} />}
          onClick={() => {
            modal.confirm({
              title: 'Bạn có chắc chắn muốn xóa thông báo này không?',
              okText: 'Xóa',
              cancelText: 'Hủy',
              icon: <ExclamationCircleFilled style={{ color: 'red' }} />,
              content:
                'Thông báo này sẽ không thể khôi phục, bạn có chắc chắn muốn xóa ?',
              onOk: () => {
                handleDeleteNotification(item.id)
              },
            })
          }}
        />
      </div>
    ),
  }))

  return (
    <div className="h-[calc(100vh-89px)] overflow-y-auto bg-[#F6F6F6] p-[16px]">
      <Spin spinning={loading}>
        <Table<TableDataItem>
          columns={columns}
          className="custom-pagination-left"
          dataSource={dataConfig}
          pagination={{
            total: other.total,
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            pageSizeOptions: [6, 12, 18, 24, 30],
            current: currentPage,
            pageSize: currentPageSize,
            onChange: handlePaginationChange,
            onShowSizeChange: handlePaginationChange,
            showLessItems: true,
          }}
        />
      </Spin>
    </div>
  )
}

export default NotificationTable
