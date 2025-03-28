'use client'

import { ResourceCategoryModalForm, ResourceModalForm } from '@/components'
import { EllipsisOutlined } from '@ant-design/icons'
import { App, Button, Dropdown, MenuProps, message } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { deleteResourceCategoryAction } from '../../action'
export type ResourcesExtraProps = {
  resource?: any
  options?: any
}

const ResourcesExtra: React.FC<ResourcesExtraProps> = ({
  resource,
  options,
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { modal } = App.useApp()
  const router = useRouter()

  const { resourcesCategories } = options

  const handleDelete = async (rId: number) => {
    setLoading(true)

    try {
      const { message: msg, errors } = await deleteResourceCategoryAction(rId)

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Xóa danh mục thành công')
      setLoading(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  const items: MenuProps['items'] = [
    {
      key: 'edit',
      label: (
        <ResourceCategoryModalForm mode="edit" initialValues={resource}>
          Sửa danh mục
        </ResourceCategoryModalForm>
      ),
    },
    {
      key: 'add',
      label: (
        <ResourceModalForm
          initialValues={{
            category_resource_id: resourcesCategories[0]?.id,
          }}
        >
          Thêm tài liệu
        </ResourceModalForm>
      ),
    },
    {
      key: 'delete',
      label: 'Xóa danh mục',
      danger: true,
      onClick: () => {
        modal.confirm({
          title: 'Xóa danh mục',
          content: (
            <span>
              Bạn có chắc chắn muốn xóa danh mục{' '}
              <span className="font-[600]">{resource?.name}</span> không?
            </span>
          ),
          onOk: () => handleDelete(resource?.id || 0),
          onCancel: () => setOpen(false),
          open,
          okButtonProps: {
            loading,
          },
        })
      },
    },
  ]

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <Button icon={<EllipsisOutlined />} />
    </Dropdown>
  )
}

export default ResourcesExtra
