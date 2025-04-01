'use client'

import { Form, Input, Select, SelectProps } from 'antd'
import React from 'react'
import useSWR from 'swr'
import { getAccountsAsAttendanceAction } from '../action'

export type EmployeeSelectFormItemBoxProps = {
  className?: string
}

const EmployeeSelectFormItemBox: React.FC<EmployeeSelectFormItemBoxProps> = ({
  className,
}) => {
  const { data, isLoading } = useSWR(
    'attendance-accounts',
    getAccountsAsAttendanceAction,
  )

  const accountOptions: SelectProps['options'] = data?.map((item: any) => ({
    label: item.full_name,
    value: item.id,
  }))

  return (
    <div className={className}>
      <div className="flex items-center gap-[16px]">
        <Form.Item
          className="mb-[16px]! flex-1"
          label="Tài khoản"
          name="account_id"
          rules={[{ required: true, message: 'Nhập tài khoản' }]}
        >
          <Select
            placeholder="Nhập tài khoản"
            options={accountOptions}
            loading={isLoading}
            showSearch
          />
        </Form.Item>
        <Form.Item
          className="mb-[16px]! flex-1"
          label="Chọn email nhân sự"
          rules={[{ required: true, message: 'Chọn mail nhân sự' }]}
        >
          <Input placeholder="Email nhân sự" disabled />
        </Form.Item>
      </div>
    </div>
  )
}

export default EmployeeSelectFormItemBox
