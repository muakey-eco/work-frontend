'use client'

import type { TableProps } from 'antd'
import { Table } from 'antd'
import React from 'react'

interface DataType {
  id: number
  full_name: string
  position: string
  gender: string
  phone: string
  email: string
  birthday: string
}

const columns: TableProps<DataType>['columns'] = [
  {
    title: 'Họ và tên',
    dataIndex: 'full_name',
    key: 'full_name',
    render: (text: string) => <span>{text || '--'}</span>,
    sorter: (a, b) => (a.full_name || '').localeCompare(b.full_name || ''),
  },
  {
    title: 'Chức danh',
    dataIndex: 'position',
    key: 'position',
    render: (text: string) => <span>{text || '--'}</span>,
    sorter: (a, b) => (a.position || '').localeCompare(b.position || ''),
  },
  {
    title: 'Giới tính',
    dataIndex: 'gender',
    key: 'gender',
    filters: [
      { text: 'Nam', value: 'Nam' },
      { text: 'Nữ', value: 'Nữ' },
    ],
    render: (text: string) => <span>{text || '--'}</span>,
    sorter: (a, b) => (a.gender || '').localeCompare(b.gender || ''),
  },
  {
    title: 'Ngày sinh',
    dataIndex: 'birthday',
    key: 'birthday',
    render: (text: string) => <span>{text || '--'}</span>,
    sorter: (a, b) => (a.birthday || '').localeCompare(b.birthday || ''),
  },
  {
    title: 'Điện thoại',
    dataIndex: 'phone',
    key: 'phone',
    render: (text: string) => <span>{text || '--'}</span>,
    sorter: (a, b) => (a.phone || '').localeCompare(b.phone || ''),
  },
  {
    title: 'Email cá nhân',
    dataIndex: 'email',
    key: 'email',
    render: (text: string) => <span>{text || '--'}</span>,
    sorter: (a, b) => (a.email || '').localeCompare(b.email || ''),
  },
]

const EmployeePageTable: React.FC<{
  members: {
    id: number
    name: string
    members: DataType[]
  }
}> = ({ members }) => {
  return (
    <div className="h-[calc(100vh-89px)] bg-[#F6F6F6] p-[16px]">
      <Table
        columns={columns}
        dataSource={members?.members}
        pagination={false}
      />
    </div>
  )
}

export default EmployeePageTable
