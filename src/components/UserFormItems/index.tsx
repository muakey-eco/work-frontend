'use client'

import { getAccountsAsAttendanceAction } from '@/app/(work)/asset/components/action'
import { useAsyncEffect } from '@/libs/hook'
import { Form, FormItemProps, Select } from 'antd'
import { useState } from 'react'

type AssetUserFormItemProps = FormItemProps

const AssetUserFormItem: React.FC<AssetUserFormItemProps> = ({ ...props }) => {
  const [users, setUsers] = useState<any[]>([])
  useAsyncEffect(async () => {
    try {
      const res = await getAccountsAsAttendanceAction()
      const validUsers = Array.isArray(res)
        ? res.filter((user) => user && user.id)
        : []
      setUsers(validUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    }
  }, [])

  return (
    <Form.Item {...props}>
      <Select
        placeholder="Chọn người sử dụng"
        options={users}
        fieldNames={{ label: 'full_name', value: 'id' }}
      />
    </Form.Item>
  )
}

export default AssetUserFormItem
