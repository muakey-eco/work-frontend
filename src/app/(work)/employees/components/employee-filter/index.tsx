'use client'

import { DownOutlined, FilterOutlined } from '@ant-design/icons'
import { Button, Input, Select } from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

export type EmployeeFilterProps = {}

const EmployeeFilter: React.FC<EmployeeFilterProps> = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = new URLSearchParams(searchParams)
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

  const search = query.get('search')
  const handleSearch = (value: string) => {
    if (value) {
      query.set('search', value)
    } else {
      query.delete('search')
    }
    query.delete('page')
    router.push(`?${query.toString()}`)
  }

  return (
    <div className="flex items-center gap-[16px]">
      <Input.Search
        className="!w-[278px]"
        defaultValue={search || ''}
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
