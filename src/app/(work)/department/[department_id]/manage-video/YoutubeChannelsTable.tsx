'use client'

import useStyle from '@/ui/hook/useStyle'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'
import type { TableProps } from 'antd'
import { App, Button, Table } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React from 'react'
import { deleteYoutubeChannelAction } from './action'

interface DataType {
  id: number
  name: string
  default_title: string
  default_tags: string
  playlist: string
  created_at: string
}

const YoutubeChannelsTable: React.FC<{ data: DataType[] }> = ({ data }) => {
  const { styles } = useStyle()
  const { modal, message } = App.useApp()
  const router = useRouter()

  const handleDeleteYoutubeChannel = async (id: number) => {
    try {
      modal.confirm({
        title: 'Xóa kênh',
        content: 'Bạn có chắc chắn muốn xóa kênh này không?',
        onOk: async () => {
          await deleteYoutubeChannelAction(id)
          message.success('Xóa kênh thành công')
          router.refresh()
        },
      })
    } catch (error) {
      console.log(error)
    }
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Tên kênh',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      defaultSortOrder: 'ascend',
      render: (text: string) => <span>{text || '--'}</span>,
    },
    {
      title: 'Tiêu đề mặc định',
      dataIndex: 'default_title',
      key: 'default_title',
      sorter: (a, b) => a.default_title.localeCompare(b.default_title),
      render: (text: string) => <span>{text || '--'}</span>,
    },
    {
      title: 'Tag mặc định',
      dataIndex: 'default_tags',
      key: 'default_tags',
      sorter: (a, b) => a.default_tags.localeCompare(b.default_tags),
      render: (text: string) => <span>{text || '--'}</span>,
    },
    {
      title: 'Danh sách phát',
      dataIndex: 'playlist',
      key: 'playlist',
      sorter: (a, b) => a.playlist.localeCompare(b.playlist),
      render: (text: string) => <span>{text || '--'}</span>,
    },
    {
      title: 'Ngày tạo kênh',
      dataIndex: 'created_at',
      key: 'created_at',
      sorter: (a, b) => dayjs(a.created_at).diff(dayjs(b.created_at)),
      render: (text: string) => (
        <span>{dayjs(text).format('DD/MM/YYYY HH:mm:ss') || '--'}</span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 100,
      align: 'center',
      render: (_, record) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="outlined"
            icon={<EditOutlined />}
            size="small"
            color="primary"
          />
          <Button
            variant="outlined"
            icon={<DeleteOutlined />}
            size="small"
            color="danger"
            onClick={() => handleDeleteYoutubeChannel(record.id)}
          />
        </div>
      ),
    },
  ]

  return (
    <div
      className={clsx(
        'h-[calc(100vh-89px)] w-full bg-[#F6F6F6] p-[16px]',
        styles.customTable,
      )}
    >
      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </div>
  )
}

export default YoutubeChannelsTable
