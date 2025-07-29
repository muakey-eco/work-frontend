'use client'

import type { TableProps } from 'antd'
import { Table } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

interface DataType {
  id: number
  name: string
  default_title: string
  default_tags: string
  playlist: string
  created_at: string
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
    render: (text: string) => (
      <span>{dayjs(text).format('DD/MM/YYYY') || '--'}</span>
    ),
    sorter: (a, b) => a.default_tags.localeCompare(b.default_tags),
  },
  {
    title: 'Danh sách phát',
    dataIndex: 'playlist',
    key: 'playlist',
    render: (text: string) => <span>{text || '--'}</span>,
    sorter: (a, b) => a.playlist.localeCompare(b.playlist),
  },
  {
    title: 'Ngày tạo kênh',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (text: string) => (
      <span>{dayjs(text).format('DD/MM/YYYY HH:mm:ss') || '--'}</span>
    ),
    sorter: (a, b) => dayjs(a.created_at).diff(dayjs(b.created_at)),
  },
]

const TiktokUploadsTable: React.FC<{
  data: DataType[]
}> = ({ data }) => {
  return (
    <div className="h-[calc(100vh-89px)] bg-[#F6F6F6] p-[16px]">
      <Table columns={columns} dataSource={data} pagination={false} />
    </div>
  )
}

export default TiktokUploadsTable
