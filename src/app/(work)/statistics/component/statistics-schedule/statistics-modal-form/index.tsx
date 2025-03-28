'use client'

import { TiptapEditor } from '@/components'
import { PlusOutlined } from '@ant-design/icons'
import { App, Button, DatePicker, Form, Input, Modal, Select } from 'antd'
import vn from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { addTodoAction } from '../action'

type StatisticsModalFormProps = {
  options?: any
}

const StatisticsModalForm: React.FC<StatisticsModalFormProps> = ({
  options,
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()
  const router = useRouter()

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    try {
      const { message: msg, errors } = await addTodoAction({
        ...formData,
        expired_at: dayjs(formData.expired_at).format('YYYY-MM-DD HH:mm:ss'),
      })

      if (errors) {
        message.error(msg)
        return
      }

      setOpen(false)
      setLoading(false)
      message.success('Thêm thành công.')
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  return (
    <>
      <Button
        className="z-10 size-[48px]! shadow-[0_6px_16px_0_rgba(0,0,0,0.08),0_3px_6px_-4px_rgba(0,0,0,0.12),0_9px_28px_8px_rgba(0,0,0,0.05)]"
        shape="circle"
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
      />
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="Thêm công việc"
        modalRender={(dom) => (
          <Form
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={{
              account_id: options?.accountId,
            }}
          >
            {dom}
          </Form>
        )}
        width={760}
        okText="Thêm mới"
        cancelText="Bỏ qua"
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        destroyOnClose
      >
        <Form.Item
          name="name"
          label="Tên công việc"
          rules={[
            {
              required: true,
              message: 'Tên công việc không được để trống',
            },
          ]}
        >
          <Input placeholder="Tên công việc" />
        </Form.Item>
        <Form.Item
          rootClassName="min-h-[240px]"
          name="description"
          label="Mô tả"
          valuePropName="content"
        >
          <TiptapEditor placeholder="Mô tả" />
        </Form.Item>
        <Form.Item
          name="account_id"
          label="Giao cho"
          rules={[
            {
              required: true,
              message: 'Lựa chọn 1 người thực thi',
            },
          ]}
        >
          <Select
            placeholder="-- Lựa chọn một người dưới đây --"
            options={[
              ...options?.accounts?.map((acc: any) => ({
                label: acc?.full_name,
                value: acc?.id,
              })),
            ]}
            allowClear
          />
        </Form.Item>
        <Form.Item
          name="expired_at"
          label="Thời hạn"
          rules={[
            {
              required: true,
              message: 'Thời hạn không được để trống',
            },
          ]}
        >
          <DatePicker
            className="w-full"
            placeholder="Thời hạn"
            locale={vn}
            showTime
          />
        </Form.Item>
      </Modal>
    </>
  )
}

export default StatisticsModalForm
