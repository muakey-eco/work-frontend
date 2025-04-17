'use client'

import { EditOutlined } from '@ant-design/icons'
import { Table, TableProps } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

export type WorkLeaveHistoryTableProps = TableProps & {
  dataTable?: any[]
}

const evaluationOptions = [
  {
    label: 'Loại nghỉ tốt',
    value: 'good',
  },
  {
    label: 'Loại nghỉ xấu',
    value: 'bad',
  },
  {
    label: 'Trung bình',
    value: 'average',
  },
]

const WorkLeaveHistoryTable: React.FC<WorkLeaveHistoryTableProps> = ({
  dataTable,
  ...props
}) => {
  const columns = [
    {
      title: '#',
      dataIndex: 'id',
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
    },
    {
      title: 'Ngày nghỉ việc',
      dataIndex: 'created_at',
      render: (text: string) => {
        return dayjs(text).format('DD/MM/YYYY')
      },
    },
    {
      title: 'Đánh giá',
      dataIndex: 'evaluate',
      render: (text: string) => {
        return evaluationOptions.find((option) => option.value === text)?.label
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (text: string) => {
        return text === 'active' ? (
          <div className="text-[#389E0D]">Khả dụng</div>
        ) : (
          'Không khả dụng'
        )
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: () => {
        return <EditOutlined style={{ color: '#1677FF', fontSize: 20 }} />
      },
    },
  ]

  return <Table columns={columns} dataSource={dataTable} {...props} />
}

export default WorkLeaveHistoryTable
