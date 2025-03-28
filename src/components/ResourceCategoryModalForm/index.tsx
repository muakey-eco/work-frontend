'use client'

import { App, Button, Form, Input, Modal } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {
  createResourceCategoryAction,
  updateResourceCategoryAction,
} from '../action'

export type ResourceCategoryModalFormProps = {
  children?: React.ReactNode
  initialValues?: any
  mode?: 'create' | 'edit'
}

const ResourceCategoryModalForm: React.FC<ResourceCategoryModalFormProps> = ({
  children,
  initialValues,
  mode = 'create',
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setLoading(true)

    try {
      if (mode === 'create') {
        var { message: msg, errors } =
          await createResourceCategoryAction(values)
      } else {
        var { message: msg, errors } = await updateResourceCategoryAction(
          initialValues?.id,
          {
            ...initialValues,
            ...values,
          },
        )
      }

      if (errors) {
        message.error(msg)
        setOpen(false)
        setLoading(false)
        return
      }

      message.success(
        mode === 'create'
          ? 'Tạo danh mục thành công'
          : 'Sửa danh mục thành công',
      )
      setOpen(false)
      setLoading(false)
      router.refresh()
      form.resetFields()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Modal
        title={mode === 'create' ? 'Tạo danh mục' : 'Sửa danh mục'}
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            form={form}
            layout="vertical"
            initialValues={initialValues || {}}
            onFinish={handleSubmit}
          >
            {dom}
          </Form>
        )}
        footer={
          <Button type="primary" htmlType="submit" loading={loading}>
            {mode === 'create' ? 'Tạo' : 'Sửa'}
          </Button>
        }
      >
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
        >
          <Input placeholder="Nhập tên danh mục" />
        </Form.Item>
      </Modal>
    </>
  )
}

export default ResourceCategoryModalForm
