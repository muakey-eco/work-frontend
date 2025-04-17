import { EditOutlined } from '@ant-design/icons'
import { Table, TableProps } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

export type JobProgressTableProps = TableProps & {}

const JobProgressTable: React.FC<JobProgressTableProps> = (props) => {
  const columns = [
    {
      title: 'Vị trí công việc',
      dataIndex: 'name',
    },
    {
      title: 'Lương',
      dataIndex: ['salary', 'basic_salary'],
    },
    {
      title: 'Tệp đính kèm',
      dataIndex: 'attachment',
      render: (value: string) => {
        return value ? value : '--'
      },
    },
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      render: (value: string) => {
        return value ? dayjs(value).format('DD/MM/YYYY') : '--'
      },
    },
    {
      title: 'Hành động',
      dataIndex: 'action',
      render: () => {
        return <EditOutlined className="!text-[#1677ff]" />
      },
    },
  ]

  return <Table columns={columns} {...props} />
}

export default JobProgressTable
