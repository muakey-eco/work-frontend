'use client'

import { DownOutlined, FilterOutlined } from '@ant-design/icons'
import { Button, Input, Select } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'

export type EmployeeFilterProps = {}

const EmployeeFilter: React.FC<EmployeeFilterProps> = () => {
  const router = useRouter()

  const statusOptions = [
    {
      label: 'Chính thức',
      value: 'official',
    },
    {
      label: 'Thử việc',
      value: 'trial',
    },
    {
      label: 'Nghỉ việc',
      value: ' quit',
    },
  ]

  const handleSearch = (value: string) => {
    try {
      if (value) {
        router.push(`?search=${value}`)
      } else {
        router.push(`?search=`)
      }
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <div className="flex items-center gap-[16px]">
      <Input.Search
        className="!w-[278px]"
        placeholder="Tìm kiếm nhân sự"
        onSearch={handleSearch}
      />
      <Select options={statusOptions} defaultValue={statusOptions[0].value} />
      <Button icon={<FilterOutlined />}>Bộ lọc (2)</Button>
      <Button icon={<DownOutlined />}>Sắp xếp</Button>
    </div>
  )
}

export default EmployeeFilter
