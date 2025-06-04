'use client'

import { Button, Form, FormInstance, Input, Modal, Select } from 'antd'
import { useParams, useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'
import { addTaskFieldsAction, editCustomFieldAction } from '../../../action'

type CustomFieldsModalFormProps = {
  children?: React.ReactNode
  options?: any
  action?: 'create' | 'edit'
}

const CustomFieldsModalForm: React.FC<CustomFieldsModalFormProps> = ({
  children,
  options,
  action = 'create',
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [type, setType] = useState('')
  const { stages, initialValues, fieldId } = options

  const params = useParams()
  const router = useRouter()
  const formRef = useRef<FormInstance>(null)

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    try {
      if (action === 'create') {
        var { errors } = await addTaskFieldsAction({
          ...formData,
          workflow_id: Number(params?.id),
        })
      } else {
        var { errors } = await editCustomFieldAction(fieldId, {
          ...formData,
          workflow_id: Number(params?.id),
        })
      }

      if (errors) {
        if (typeof errors === 'string') {
          toast.error(errors)
        } else {
          formRef.current?.setFields(
            Object.keys(errors).map((k: string) => ({
              name: k,
              errors: errors[k],
            })),
          )
        }

        setLoading(false)
        return
      }

      toast.success(
        action === 'create' ? 'Thêm thành công' : 'Cập nhật thành công',
      )
      setOpen(false)
      setLoading(false)
      router.refresh()
    } catch (error: any) {
      setLoading(false)
      throw new Error(error)
    }
  }

  return (
    <>
      <div
        onClick={() => {
          action === 'edit' && setType(initialValues?.type)
          setOpen(true)
        }}
      >
        {children}
      </div>
      <Modal
        title={
          action === 'create'
            ? 'THÊM TRƯỜNG DỮ LIỆU TÙY CHỈNH'
            : 'CHỈNH SỬA TRƯỜNG DỮ LIỆU TÙY CHỈNH'
        }
        open={open}
        width={520}
        footer={null}
        onCancel={() => setOpen(false)}
        destroyOnClose
      >
        <Form
          onFinish={handleSubmit}
          labelCol={{ flex: '24px' }}
          wrapperCol={{ flex: 1 }}
          initialValues={initialValues}
          ref={formRef}
        >
          <Form.Item
            label="Loại dữ liệu"
            name="type"
            rules={[
              {
                required: true,
                message: 'Chọn 1 loại dữ liệu.',
              },
            ]}
            layout="vertical"
            initialValue="number"
          >
            <Select
              className="w-full"
              options={[
                { value: 'number', label: 'Số nguyên' },
                { value: 'paragraph', label: 'Văn bản' },
                { value: 'date', label: 'Ngày' },
                { value: 'list', label: 'Danh sách' },
              ]}
              onChange={(value) => setType(value)}
            />
          </Form.Item>
          <Form.Item
            label="Tên trường dữ liệu"
            name="name"
            rules={[
              {
                required: true,
                message: 'Nhập tên trường dữ liệu.',
              },
            ]}
            layout="vertical"
          >
            <Input placeholder="Tên trường dữ liệu" />
          </Form.Item>
          <Form.Item
            label="Giải thích trường dữ liệu"
            name="description"
            layout="vertical"
          >
            <Input placeholder="Một số ký tự đặc biệt không hỗ trợ, ví dụ: < > ;" />
          </Form.Item>
          {type === 'list' && (
            <Form.Item
              label="Các lựa chọn cách nhau bởi dấu phẩy"
              name="options"
              rules={[
                {
                  required: true,
                  message: 'Nhập lựa chọn.',
                },
              ]}
              layout="vertical"
            >
              <Input placeholder="Một số ký tự đặc biệt không hỗ trợ, ví dụ: < > ;" />
            </Form.Item>
          )}
          <Form.Item
            label="Trường bắt buộc"
            name="require"
            layout="vertical"
            initialValue={false}
          >
            <Select
              className="w-full"
              options={[
                { value: false, label: 'Không bắt buộc' },
                { value: true, label: 'Bắt buộc trả lời' },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <div className="flex items-center gap-[16px]">
              <Button className="flex-1" onClick={() => setOpen(false)}>
                Bỏ qua
              </Button>
              <Button
                className="flex-1"
                color="primary"
                type="primary"
                htmlType="submit"
                loading={loading}
              >
                {action === 'create' ? 'Thêm trường mới' : 'Cập nhật'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default CustomFieldsModalForm
