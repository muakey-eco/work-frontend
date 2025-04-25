'use client'

import { convertToSlug } from '@/lib/utils'
import { MoreOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { App, Dropdown, Space } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { deleteTabAction } from '../action'
import ViewModalForm from '../view-modal-form'
type ViewOptionProps = {
  name: string
  children?: React.ReactNode
  id?: string
  onMenuClick?: MenuProps['onClick']
  activeTab?: string
  onDelete?: (id: string) => void
}

const ViewOption: React.FC<ViewOptionProps> = ({
  name,
  children,
  id,
  onMenuClick,
  activeTab,
  onDelete,
}) => {
  const { message } = App.useApp()
  const router = useRouter()
  const [editOpen, setEditOpen] = useState(false)

  const handleDelete = async () => {
    if (!id) {
      message.error('Không tìm thấy ID để xóa')
      return
    }

    try {
      const res = await deleteTabAction(id)

      if (res) {
        router.refresh()
        message.success('Xóa thành công')
        onDelete?.(id)
        router.push(`/employees?view=${convertToSlug(name)}`)
      } else {
        message.error('Xóa thất bại')
      }
    } catch (error) {
      console.error('Delete error:', error)
      message.error('Có lỗi xảy ra khi xóa')
    }
  }

  const items: MenuProps['items'] = [
    {
      label: 'Chỉnh sửa',
      key: 'edit',
      onClick: () => setEditOpen(true),
    },
    {
      label: 'Xóa',
      key: 'delete',
      onClick: handleDelete,
    },
  ]
  return (
    <Space>
      <span>{name}</span>

      <Dropdown
        menu={{ items, onClick: onMenuClick }}
        trigger={['click']}
        placement="bottomRight"
      >
        <span onClick={(e) => e.preventDefault()}>
          {activeTab === convertToSlug(name) && (children ?? <MoreOutlined />)}
        </span>
      </Dropdown>
      <ViewModalForm
        open={editOpen}
        action="update"
        viewId={id}
        onCancel={() => setEditOpen(false)}
        onOpen={setEditOpen}
      />
    </Space>
  )
}

export default ViewOption
