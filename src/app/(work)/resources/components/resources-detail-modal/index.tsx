'use client'

import { ResourceModalForm } from '@/components'
import { randomColor } from '@/libs/utils'
import {
  App,
  Avatar,
  Button,
  Modal,
  ModalProps,
  Tooltip,
  Typography,
} from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { deleteResourceAction } from '../../action'
type ResourceType = {
  label: string
  value: any
  copyable?: boolean
}

export type ResourcesDetailModalProps = ModalProps & {
  children?: React.ReactNode
  resources: ResourceType[]
  initialValues?: any
}

const ResourcesDetailModal: React.FC<ResourcesDetailModalProps> = ({
  children,
  resources,
  initialValues,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { message, modal } = App.useApp()

  const handleDelete = async (id: number) => {
    setLoading(true)

    try {
      const { message: msg, errors } = await deleteResourceAction(id)

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Xóa thành công')
      setOpen(false)
      setLoading(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
      <Modal
        classNames={{
          header: 'mb-[16px]!',
        }}
        open={open}
        onCancel={() => setOpen(false)}
        width={846}
        footer={
          <div className="flex items-center justify-end gap-[20px]">
            <Button
              className="w-[120px]"
              danger
              onClick={() => {
                modal.confirm({
                  title: 'Xóa tài liệu',
                  content: (
                    <span>
                      Bạn có chắc chắn muốn xóa danh mục tài liệu{' '}
                      <span className="font-[600]">{initialValues?.name}</span>{' '}
                      không?
                    </span>
                  ),
                  onOk: () => handleDelete(initialValues?.id),
                  okButtonProps: {
                    loading,
                  },
                })
              }}
            >
              Xóa
            </Button>
            <ResourceModalForm initialValues={initialValues} mode="edit">
              <Button className="w-[120px]" type="primary">
                Chỉnh sửa
              </Button>
            </ResourceModalForm>
          </div>
        }
        destroyOnClose
        {...props}
      >
        <div className="flex flex-col gap-[16px]">
          {resources.map((resource, index) => (
            <div key={index} className="flex items-start gap-[8px]">
              <span className="inline-block w-[160px]">{resource?.label}:</span>
              {Array.isArray(resource?.value) ? (
                <Avatar.Group
                  max={{
                    count: 3,
                    style: {
                      backgroundColor: '#fde3cf',
                      color: '#f56a00',
                    },
                  }}
                >
                  {resource?.value.map((item: any) => {
                    return (
                      <Tooltip key={item?.id} title={item?.full_name}>
                        <Avatar
                          key={item?.id}
                          src={item?.avatar}
                          style={{
                            backgroundColor: randomColor(
                              String(item?.full_name),
                            ),
                          }}
                        >
                          {String(item?.full_name).charAt(0).toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    )
                  })}
                </Avatar.Group>
              ) : resource?.copyable ? (
                <Typography.Text className="flex-1 font-[500]" copyable>
                  {resource?.value}
                </Typography.Text>
              ) : (
                <div className="flex-1">{resource?.value}</div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </>
  )
}

export default ResourcesDetailModal
