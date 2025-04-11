'use client'

import type { TableColumnsType, TableProps } from 'antd'
import { Avatar, Table } from 'antd'
import React, { useState } from 'react'

type OnChange = NonNullable<TableProps<DataType>['onChange']>
type Filters = Parameters<OnChange>[1]
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

interface Executor {
  name: string
  avatar: string
}

interface DataType {
  key: string
  productName: string
  data: string
  revenue: string
  commission: string
  received: string
  completionTime: string
  executors: Executor[]
}

const data: DataType[] = [
  {
    key: '1',
    productName:
      'Dark Legion - giới thiệu game và đăng ký trước kỳ game để nhận quà',
    data: '👁️ 1.3M, 👍 2.4K, 💬 100, ⏱️ 234, 📅 40',
    revenue: '500,000 đ',
    commission: '240,000 đ',
    received: '240,000 đ',
    completionTime: '8.6',
    executors: [
      { name: 'User A', avatar: 'https://i.pravatar.cc/150?u=a' },
      { name: 'User B', avatar: 'https://i.pravatar.cc/150?u=b' },
      { name: 'User C', avatar: 'https://i.pravatar.cc/150?u=c' },
      { name: '+2', avatar: '' },
    ],
  },
  {
    key: '2',
    productName:
      'Dark Legion - giới thiệu game và đăng ký trước kỳ game để nhận quà',
    data: '👁️ 1.3M, 👍 2.4K, 💬 100, ⏱️ 234, 📅 40',
    revenue: '500,000 đ',
    commission: '240,000 đ',
    received: '240,000 đ',
    completionTime: '8',
    executors: [
      { name: 'User A', avatar: 'https://i.pravatar.cc/150?u=a' },
      { name: 'User B', avatar: 'https://i.pravatar.cc/150?u=b' },
      { name: 'User C', avatar: 'https://i.pravatar.cc/150?u=c' },
      { name: '+2', avatar: '' },
    ],
  },
  {
    key: '3',
    productName:
      'Dark Legion - giới thiệu game và đăng ký trước kỳ game để nhận quà',
    data: '👁️ 1.3M, 👍 2.4K, 💬 100, ⏱️ 234, 📅 40',
    revenue: '500,000 đ',
    commission: '240,000 đ',
    received: '240,000 đ',
    completionTime: '8',
    executors: [
      { name: 'User A', avatar: 'https://i.pravatar.cc/150?u=a' },
      { name: 'User B', avatar: 'https://i.pravatar.cc/150?u=b' },
      { name: 'User C', avatar: 'https://i.pravatar.cc/150?u=c' },
      { name: '+2', avatar: '' },
    ],
  },
  {
    key: '4',
    productName:
      'Dark Legion - giới thiệu game và đăng ký trước kỳ game để nhận quà',
    data: '👁️ 1.3M, 👍 2.4K, 💬 100, ⏱️ 234, 📅 40',
    revenue: '500,000 đ',
    commission: '240,000 đ',
    received: '240,000 đ',
    completionTime: '8',
    executors: [
      { name: 'User A', avatar: 'https://i.pravatar.cc/150?u=a' },
      { name: 'User B', avatar: 'https://i.pravatar.cc/150?u=b' },
      { name: 'User C', avatar: 'https://i.pravatar.cc/150?u=c' },
      { name: '+2', avatar: '' },
    ],
  },
  {
    key: '5',
    productName:
      'Dark Legion - giới thiệu game và đăng ký trước kỳ game để nhận quà',
    data: '👁️ 1.3M, 👍 2.4K, 💬 100, ⏱️ 234, 📅 40',
    revenue: '500,000 đ',
    commission: '240,000 đ',
    received: '240,000 đ',
    completionTime: '8',
    executors: [
      { name: 'User A', avatar: 'https://i.pravatar.cc/150?u=a' },
      { name: 'User B', avatar: 'https://i.pravatar.cc/150?u=b' },
      { name: 'User C', avatar: 'https://i.pravatar.cc/150?u=c' },
      { name: '+2', avatar: '' },
    ],
  },
]

const MarketingDetail: React.FC = () => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters)
    setSortedInfo(sorter as Sorts)
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'productName',
      key: 'productName',
      //   ellipsis: true,
      width: 335,
      sorter: (a, b) => a.productName.length - b.productName.length,
    },
    {
      title: 'Số liệu',
      dataIndex: 'data',
      key: 'data',
      ellipsis: true,
      width: 335,
      render: (text) => <span>{text}</span>,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'revenue',
      key: 'revenue',
      sorter: (a, b) =>
        parseFloat(a.revenue.replace(/[^\d]/g, '')) -
        parseFloat(b.revenue.replace(/[^\d]/g, '')),
      ellipsis: true,
    },
    {
      title: 'Hoa hồng',
      dataIndex: 'commission',
      key: 'commission',
      sorter: (a, b) =>
        parseFloat(a.commission.replace(/[^\d]/g, '')) -
        parseFloat(b.commission.replace(/[^\d]/g, '')),
      ellipsis: true,
    },
    {
      title: 'Thực nhận',
      dataIndex: 'received',
      key: 'received',
      sorter: (a, b) =>
        parseFloat(a.received.replace(/[^\d]/g, '')) -
        parseFloat(b.received.replace(/[^\d]/g, '')),
      ellipsis: true,
    },
    {
      title: 'Thời gian HT (giờ)',
      dataIndex: 'completionTime',
      key: 'completionTime',
      sorter: (a, b) =>
        parseFloat(a.completionTime) - parseFloat(b.completionTime),
      ellipsis: true,
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'executors',
      key: 'executors',
      render: (executors: Executor[]) => (
        <Avatar.Group>
          {executors.map((e, index) =>
            e.avatar ? (
              <Avatar key={index} src={e.avatar} alt={e.name} />
            ) : (
              <Avatar key={index}>{e.name}</Avatar>
            ),
          )}
        </Avatar.Group>
      ),
    },
  ]

  return (
    <Table<DataType>
      columns={columns}
      dataSource={data}
      onChange={handleChange}
      pagination={false}
    />
  )
}

export default MarketingDetail
