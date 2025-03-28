'use client'

import { App, Checkbox, Form, FormProps, Input, Modal, ModalProps } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { updateProfileAction } from '../action'

export type ProfileContactModalFormProps = ModalProps & {
  initialValues?: any
  children?: React.ReactNode
  formProps?: FormProps
  mode?: 'create' | 'edit'
}

const ProfileContactModalForm: React.FC<ProfileContactModalFormProps> = ({
  initialValues,
  children,
  formProps,
  mode = 'create',
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { message } = App.useApp()
  const router = useRouter()

  const { userId, ...restInitialValues } = initialValues

  const handleSubmit = async (values: any) => {
    setLoading(true)

    try {
      if (mode === 'create') {
        var { message: msg, errors } = await updateProfileAction(userId, {
          family_member: {
            ...values,
          },
        })
      } else {
        var { message: msg, errors } = await updateProfileAction(userId, {
          family_member: {
            id: restInitialValues?.id,
            ...values,
          },
        })
      }

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success(
        mode === 'create' ? 'Thêm thành công' : 'Cập nhật thành công',
      )
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
        title="Gia đình, người phụ thuộc và người liên hệ khác"
        open={open}
        destroyOnClose
        okText="Lưu"
        cancelText="Hủy"
        width={846}
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              ...restInitialValues,
            }}
            {...formProps}
          >
            {dom}
          </Form>
        )}
        onCancel={() => setOpen(false)}
        {...props}
      >
        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: 'Họ và tên là bắt buộc' }]}
          >
            <Input placeholder="Nhập" />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Mối quan hệ"
            name="relationship"
            rules={[{ required: true, message: 'Mối quan hệ là bắt buộc' }]}
          >
            <Input placeholder="Nhập" />
          </Form.Item>
        </div>

        <Form.Item
          className="mb-[16px]!"
          label="Liên hệ"
          name="phone_number"
          rules={[{ required: true, message: 'Liên hệ là bắt buộc' }]}
        >
          <Input placeholder="Nhập" />
        </Form.Item>

        <div className="flex items-center justify-between gap-[16px]">
          <Form.Item
            className="mb-0! flex-1"
            name="is_dependent"
            valuePropName="checked"
          >
            <Checkbox>Là người phụ thuộc</Checkbox>
          </Form.Item>

          <Form.Item
            className="mb-0! flex-1"
            name="is_urgent"
            valuePropName="checked"
          >
            <Checkbox>Là liên hệ khẩn cấp</Checkbox>
          </Form.Item>

          <Form.Item
            className="mb-0! flex-1"
            name="is_household"
            valuePropName="checked"
          >
            <Checkbox>Nằm trong hộ khẩu</Checkbox>
          </Form.Item>
        </div>
      </Modal>
    </>
  )
}

export default ProfileContactModalForm
