'use client'

import { CloseOutlined } from '@ant-design/icons'
import { Button, Select, Space, Table } from 'antd'
import React, { useState } from 'react'

const { Option } = Select

const availableUsers = ['Đỗ Vân Anh', 'Đỗ Vân Em', 'Đỗ Vân Chị']

interface RowData {
  key: string
  quantity: number[]
}

const initialRows: RowData[] = Array.from({ length: 7 }, (_, index) => ({
  key: `${index}`,
  quantity: [1, 2, 1, 4],
}))

const CompareDataDetail: React.FC = () => {
  const [selectedUsers, setSelectedUsers] = useState<string[]>([
    'Đỗ Vân Anh',
    'Đỗ Vân Anh',
    'Đỗ Vân Anh',
    'Đỗ Vân Anh',
  ])
  const [rows, setRows] = useState<RowData[]>(initialRows)

  const handleRemoveUser = (index: number) => {
    const updatedUsers = [...selectedUsers]
    updatedUsers.splice(index, 1)
    setSelectedUsers(updatedUsers)

    const updatedRows = rows.map((row) => {
      const newQuantities = [...row.quantity]
      newQuantities.splice(index, 1)
      return { ...row, quantity: newQuantities }
    })
    setRows(updatedRows)
  }

  const handleChangeUser = (value: string, index: number) => {
    const updatedUsers = [...selectedUsers]
    updatedUsers[index] = value
    setSelectedUsers(updatedUsers)
  }

  const columns = [
    {
      title: 'Số lượng Video',
      dataIndex: 'quantity',
      key: 'quantity',
      render: () => (
        <span className="font-medium text-gray-700">Số lượng Video</span>
      ),
    },
    ...selectedUsers.map((user, userIndex) => ({
      title: (
        <div className="flex w-full items-center gap-2">
          <Space.Compact className="flex-1">
            <Button
              color="default"
              variant="filled"
              icon={<CloseOutlined />}
              onClick={() => handleRemoveUser(userIndex)}
              type="text"
              title="Xóa người dùng"
              className="!border-1 !border-gray-300 !text-red-500 shadow-xl"
            />
            <Select
              value={user}
              onChange={(value) => handleChangeUser(value, userIndex)}
              className="w-full items-center rounded-md shadow-sm"
              style={{ minWidth: 160 }}
              placeholder="Chọn người dùng"
              showSearch
              optionFilterProp="children"
            >
              {availableUsers.map((name) => (
                <Option key={name} value={name}>
                  {name}
                </Option>
              ))}
            </Select>
          </Space.Compact>
        </div>
      ),
      dataIndex: `user_${userIndex}`,
      key: `user_${userIndex}`,
      render: (_: any, row: RowData) => (
        <div className="text-center">{row.quantity[userIndex]}</div>
      ),
    })),
    // {
    //   title: 'Tổng',
    //   key: 'total',
    //   render: (_: any, row: RowData) => (
    //     <div className="text-center font-semibold">
    //       {row.quantity.reduce((sum, val) => sum + val, 0)}
    //     </div>
    //   ),
    // },
  ]

  return (
    <div className="overflow-auto rounded-md bg-white p-4 shadow">
      <Table
        columns={columns}
        dataSource={rows}
        pagination={false}
        bordered
        scroll={{ x: 'max-content' }}
        className="min-w-fit"
      />
    </div>
  )
}

export default CompareDataDetail
