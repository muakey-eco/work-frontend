'use client'

import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import React from 'react'
import AccountModalForm from './AccountModalForm'

type AccountActionsProps = {}

const AccountActions: React.FC<AccountActionsProps> = () => {
  return (
    <div className="flex items-center justify-between rounded-[16px] bg-[#fff] p-[24px]">
      <div className="flex w-[460px] items-center justify-between gap-[24px] rounded-[8px] bg-[#f0f3f4] px-[16px] py-[8px]">
        <Input
          className="border-none bg-transparent hover:bg-transparent focus:border-transparent focus:bg-transparent focus:shadow-none"
          placeholder="Tìm kiếm..."
        />
        <SearchOutlined className="text-[20px]" />
      </div>
      <AccountModalForm>
        <Button
          size="large"
          icon={<PlusOutlined className="text-[#fff]" />}
          type="primary"
        >
          Thêm mới
        </Button>
      </AccountModalForm>
    </div>
  )
}

export default AccountActions
