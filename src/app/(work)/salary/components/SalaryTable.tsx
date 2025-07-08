'use client'

import { randomColor } from '@/libs/utils'
import type { TableProps } from 'antd'
import { Avatar, Button, Input, Table } from 'antd'
import { createStyles } from 'antd-style'
import React, { useState } from 'react'

interface DataType {
  key: string
  full_name: string
  avatar?: string
  position: string
  department: string
  totalSalary: string
  baseSalary: string
  workDays: number
  actualWorkDays: number
  actualSalary: string
  bonus: string
  otherAllowance: string
  socialInsurance: string
  otherDeduction: string
}
const useStyle = createStyles(({ css }) => ({
  customTable: css`
    .ant-table-thead {
      tr {
        th {
          background-color: #fff;
        }
      }
    }
    .ant-table {
      .ant-table-container {
        .ant-table-body,
        .ant-table-content {
          scrollbar-width: thin;
          scrollbar-color: #eaeaea transparent;
          scrollbar-gutter: stable;
        }
      }
    }
  `,
}))

const SalaryTable: React.FC = () => {
  const { styles } = useStyle()
  const [data, setData] = useState<DataType[]>([
    {
      key: '1',
      full_name: 'Nguyễn Minh Trí',
      position: 'Chuyên viên nhân sự',
      department: 'Nhân sự',
      totalSalary: '5,656,656 đ',
      baseSalary: '8,000,000 đ',
      workDays: 24,
      actualWorkDays: 20,
      actualSalary: '5,656,656 đ',
      bonus: '1,000,000 đ',
      otherAllowance: '',
      socialInsurance: '567,000 đ',
      otherDeduction: '',
    },
  ])

  const handleInputChange = (
    key: string,
    field: keyof Pick<DataType, 'bonus' | 'otherAllowance' | 'otherDeduction'>,
    value: string,
  ) => {
    setData((prev) =>
      prev.map((item) =>
        item.key === key ? { ...item, [field]: value } : item,
      ),
    )
  }

  const columns: TableProps<DataType>['columns'] = [
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
      title: 'Chức danh',
      dataIndex: 'position',
      key: 'position',
      sorter: (a, b) => a.position.localeCompare(b.position),
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
      sorter: (a, b) => a.department.localeCompare(b.department),
    },
    {
      title: 'Tổng tiền thực lĩnh',
      dataIndex: 'totalSalary',
      key: 'totalSalary',
      sorter: (a, b) => a.totalSalary.localeCompare(b.totalSalary),
    },
    {
      title: 'Lương cơ bản',
      dataIndex: 'baseSalary',
      key: 'baseSalary',
      sorter: (a, b) => a.baseSalary.localeCompare(b.baseSalary),
    },
    {
      title: 'Ngày công',
      dataIndex: 'workDays',
      key: 'workDays',
      sorter: (a, b) => a.workDays - b.workDays,
    },
    {
      title: 'Ngày công thực tế',
      dataIndex: 'actualWorkDays',
      key: 'actualWorkDays',
      sorter: (a, b) => a.actualWorkDays - b.actualWorkDays,
    },
    {
      title: 'Lương thực tế',
      dataIndex: 'actualSalary',
      key: 'actualSalary',
      sorter: (a, b) => a.actualSalary.localeCompare(b.actualSalary),
    },
    {
      title: 'Thưởng, KPI',
      dataIndex: 'bonus',
      key: 'bonus',
      render: (text, record) => (
        <Input
          value={record.bonus}
          onChange={(e) =>
            handleInputChange(record.key, 'bonus', e.target.value)
          }
        />
      ),
      sorter: (a, b) => a.bonus.localeCompare(b.bonus),
    },
    {
      title: 'Phụ cấp khác',
      dataIndex: 'otherAllowance',
      key: 'otherAllowance',
      render: (text, record) => (
        <Input
          value={record.otherAllowance}
          onChange={(e) =>
            handleInputChange(record.key, 'otherAllowance', e.target.value)
          }
        />
      ),
      sorter: (a, b) => a.otherAllowance.localeCompare(b.otherAllowance),
    },
    {
      title: 'Lương đóng BHXH, BHYT',
      dataIndex: 'socialInsurance',
      key: 'socialInsurance',
      sorter: (a, b) => a.socialInsurance.localeCompare(b.socialInsurance),
    },
    {
      title: 'Khấu trừ khác',
      dataIndex: 'otherDeduction',
      key: 'otherDeduction',
      render: (text, record) => (
        <Input
          value={record.otherDeduction}
          onChange={(e) =>
            handleInputChange(record.key, 'otherDeduction', e.target.value)
          }
        />
      ),
      sorter: (a, b) => a.otherDeduction.localeCompare(b.otherDeduction),
    },
  ]

  return (
    <>
      <Table<DataType>
        columns={columns}
        dataSource={data}
        className={`rounded-[16px] border border-[#0505050f] bg-white ${styles.customTable}`}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
      <div className="mt-[12px] flex items-center justify-between gap-[12px]">
        <p className="text-[16px] leading-[24px] font-[700]">
          Tổng lương thực lĩnh: 100,000,000 đ
        </p>
        <Button type="primary">Chốt lương tháng 6</Button>
      </div>
    </>
  )
}

export default SalaryTable
