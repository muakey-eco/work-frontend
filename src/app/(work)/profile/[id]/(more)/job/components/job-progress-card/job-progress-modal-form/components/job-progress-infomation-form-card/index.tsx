import { useAsyncEffect } from '@/libs/hook'
import { Card, Form, Input, Select } from 'antd'
import React, { useState } from 'react'
import { getDepartmentListRequest } from '../../../../action'

export type JobProgressInfomationFormCardProps = {
  title?: string
  shouldCall?: boolean
}

const JobProgressInfomationFormCard: React.FC<
  JobProgressInfomationFormCardProps
> = ({ title, shouldCall = true }) => {
  const [department, setDepartment] = useState([])

  const departmentOptions = department?.map((item: any) => ({
    label: item.name,
    value: item.name,
  }))

  const staffTypeOptions = [
    {
      label: 'Fulltime',
      value: 'fulltime',
    },
    {
      label: 'Parttime',
      value: 'parttime',
    },
  ]

  useAsyncEffect(async () => {
    if (!shouldCall) return

    const res = await getDepartmentListRequest()

    setDepartment(res)
  }, [shouldCall])

  return (
    <Card>
      <div className="mb-[16px] text-[14px] leading-[22px] font-[600]">
        {title}
      </div>

      <div className="flex items-center gap-[16px]">
        <Form.Item
          className="mb-[16px]! flex-1"
          label="Nhân sự"
          name="full_name"
        >
          <Input placeholder="Nhập" disabled />
        </Form.Item>

        <Form.Item
          className="mb-[16px]! flex-1"
          label="Vị trí cũ"
          name="position"
        >
          <Input placeholder="Nhập" disabled />
        </Form.Item>
      </div>

      <div className="flex items-center gap-[16px]">
        <Form.Item
          className="mb-[16px]! flex-1"
          label="Phòng ban mới"
          name="department_name"
        >
          <Select
            options={departmentOptions}
            placeholder="Chọn phòng ban mới"
          />
        </Form.Item>

        <Form.Item
          className="mb-[16px]! flex-1"
          label="Vị trí mới"
          name="new_position"
        >
          <Input placeholder="Nhập" />
        </Form.Item>
      </div>

      <Form.Item
        className="mb-0! flex-1"
        label="Phân loại nhân sự mới"
        name="personnel_class"
      >
        <Select
          options={staffTypeOptions}
          placeholder="Chọn phân loại nhân sự mới"
        />
      </Form.Item>
    </Card>
  )
}

export default JobProgressInfomationFormCard
