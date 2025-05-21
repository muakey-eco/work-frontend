'use client'

import { Form, Input, Select } from 'antd'
import React from 'react'

const FormFields: React.FC<{
  manager?: any[]
}> = ({ manager }) => {
  return (
    <>
      <Form.Item name="workflow_category_id" className="hidden">
        <Input className="hidden" />
      </Form.Item>
      <Form.Item
        name="name"
        label={
          <span className="inline-block w-[160px]">Tên luồng công việc</span>
        }
        rules={[
          {
            required: true,
            message: 'Nhập tên luồng công việc',
          },
        ]}
      >
        <Input placeholder="Tên luồng công việc" />
      </Form.Item>
      <Form.Item
        name="description"
        label={<span className="inline-block w-[160px]">Mô tả</span>}
      >
        <Input placeholder="Mô tả" />
      </Form.Item>
      <Form.Item
        name="manager"
        label={
          <span className="inline-block w-[160px]">Thành viên quản lí</span>
        }
        rules={[
          {
            required: true,
            message: 'Nhập thành viên quản lí',
          },
        ]}
      >
        <Select
          mode="multiple"
          allowClear
          style={{ width: '100%' }}
          placeholder="Chọn thành viên"
          options={manager}
        />
      </Form.Item>
    </>
  )
}

export default FormFields
