'use client'

import {
  EyeOutlined,
  LikeOutlined,
  MessageOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import type { TableColumnsType, TableProps } from 'antd'
import { Avatar, Table } from 'antd'
import React, { useState } from 'react'

type OnChange = NonNullable<TableProps<DataType>['onChange']>
type Filters = Parameters<OnChange>[1]
type GetSingle<T> = T extends (infer U)[] ? U : never
type Sorts = GetSingle<Parameters<OnChange>[2]>

interface Worker {
  name: string
  avatar: string
}

interface DataType {
  key: string
  name: string
  data: string
  revenue: string
  commission_percent: string
  net_income: string
  completion_time: string
  workers: Worker[]
}

type MarketingDetailProps = {
  data: any
}
const MarketingDetail: React.FC<MarketingDetailProps> = ({ data }) => {
  const [filteredInfo, setFilteredInfo] = useState<Filters>({})
  const [sortedInfo, setSortedInfo] = useState<Sorts>({})

  const handleChange: OnChange = (pagination, filters, sorter) => {
    setFilteredInfo(filters)
    setSortedInfo(sorter as Sorts)
  }

  const columns: TableColumnsType<DataType> = [
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
      //   ellipsis: true,
      width: 335,
      sorter: (a, b) => a.name.length - b.name.length,
    },
    {
      title: 'Số liệu',
      dataIndex: 'count_youtube',
      key: 'count_youtube',
      ellipsis: true,
      width: 335,
      render: (text) => (
        <span className="flex gap-4 font-bold">
          <span className="flex items-center gap-1">
            <EyeOutlined /> {text.view_count}
          </span>
          <span className="flex items-center gap-1">
            <LikeOutlined /> {text.like_count}
          </span>
          <span className="flex items-center gap-1">
            <MessageOutlined /> {text.comment_count}
          </span>
          <span className="flex items-center gap-1">
            <img src="Gestures.svg" alt="" /> {text.click}
          </span>
          <span className="flex items-center gap-1">
            <ShoppingOutlined /> {text.order}
          </span>
        </span>
      ),
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
      dataIndex: 'commission_percent',
      key: 'commission_percent',
      sorter: (a, b) =>
        parseFloat(a.commission_percent.replace(/[^\d]/g, '')) -
        parseFloat(b.commission_percent.replace(/[^\d]/g, '')),
      ellipsis: true,
    },
    {
      title: 'Thực nhận',
      dataIndex: 'net_income',
      key: 'net_income',
      sorter: (a, b) =>
        parseFloat(a.net_income.replace(/[^\d]/g, '')) -
        parseFloat(b.net_income.replace(/[^\d]/g, '')),
      ellipsis: true,
    },
    {
      title: 'Thời gian HT (giờ)',
      dataIndex: 'completion_time',
      key: 'completion_time',
      sorter: (a, b) =>
        parseFloat(a.completion_time) - parseFloat(b.completion_time),
      ellipsis: true,
    },
    {
      title: 'Người thực hiện',
      dataIndex: 'workers',
      key: 'workers',
      render: (workers: Worker[]) => (
        <Avatar.Group>
          {workers.map((e, index) =>
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
      scroll={{ y: 320 }}
    />
  )
}

export default MarketingDetail
