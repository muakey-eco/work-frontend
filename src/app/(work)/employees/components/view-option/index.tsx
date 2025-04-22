'use client'

import { MoreOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { Dropdown, Space } from 'antd'
import React from 'react'

const items: MenuProps['items'] = [
  {
    label: 'Chỉnh sửa',
    key: 'edit',
  },
  {
    label: 'Xóa',
    key: 'delete',
  },
]

type ViewOptionProps = {
  name: string
  children?: React.ReactNode
  onMenuClick?: MenuProps['onClick']
  activeTab?: string
}

const ViewOption: React.FC<ViewOptionProps> = ({
  name,
  children,
  onMenuClick,
  activeTab,
}) => {
  console.log('activeTab', activeTab)
  console.log('name', name)
  return (
    <Space>
      <span>{name}</span>

      <Dropdown
        menu={{ items, onClick: onMenuClick }}
        trigger={['click']}
        placement="bottomRight"
      >
        <span onClick={(e) => e.preventDefault()}>
          {activeTab === name && (children ?? <MoreOutlined />)}
        </span>
      </Dropdown>
    </Space>
  )
}

export default ViewOption
