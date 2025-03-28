'use client'

import { getAccountsAsAttendanceAction } from '@/app/(work)/asset/components/action'
import { useAsyncEffect } from '@/libs/hook'
import { Form, FormItemProps, Select } from 'antd'
import { useState } from 'react'

type AssetUserFormItemProps = Omit<FormItemProps, 'status'> & {
  placeholder?: string
  status?: 'liquidated' | 'using' | undefined
  isDisabled?: boolean
}

const AssetUserFormItem: React.FC<AssetUserFormItemProps> = ({
  placeholder,
  status = 'using',
  isDisabled = false,
  ...props
}) => {
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
        placeholder={placeholder}
        options={users}
        fieldNames={{ label: 'full_name', value: 'id' }}
        allowClear
        disabled={status !== 'liquidated' && isDisabled}
      />
    </Form.Item>
  )
}

export default AssetUserFormItem
