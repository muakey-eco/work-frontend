'use client'

import { useAsyncEffect } from '@/libs/hook'
import {
  App,
  Form,
  FormProps,
  Input,
  Modal,
  ModalProps,
  Select,
  SelectProps,
} from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { addAccountAction, editAccountAction, getRolesRequest } from '../action'

export type AccountModalFormProps = ModalProps & {
  children?: React.ReactNode
  formProps?: FormProps
  initialValues?: any
  mode?: 'create' | 'edit'
}

const AccountModalForm: React.FC<AccountModalFormProps> = ({
  children,
  formProps,
  initialValues,
  mode = 'create',
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState<any[]>([])
  const router = useRouter()

  const { message } = App.useApp()

  const handleSubmit = async (values: any) => {
    setLoading(true)

    try {
      if (mode === 'create') {
        var { message: msg, errors } = await addAccountAction(values)
      } else {
        var { message: msg, errors } = await editAccountAction(
          initialValues.id,
          {
            ...initialValues,
            ...values,
          },
        )
      }

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      setOpen(false)
      setLoading(false)
      message.success(
        mode === 'create'
          ? 'Thêm tài khoản thành công.'
          : 'Cập nhật tài khoản thành công.',
      )
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  const roleOptions: SelectProps['options'] = roles?.map((role: any) => ({
    label: role.name,
    value: role.name,
  }))

  useAsyncEffect(async () => {
    if (!open) return

    const res = await getRolesRequest()

    setRoles(res)
  }, [open])

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
      <Modal
        title={mode === 'create' ? 'Tạo tài khoản mới' : 'Chỉnh sửa tài khoản'}
        open={open}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={initialValues}
            {...formProps}
          >
            {dom}
          </Form>
        )}
        width={846}
        destroyOnClose
        {...props}
      >
        <div className="flex items-start gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Họ và tên"
            name="full_name"
            rules={[{ required: true, message: 'Họ và tên là bắt buộc' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Tài khoản"
            name="username"
          >
            <Input placeholder="Nhập tên tài khoản" />
          </Form.Item>
        </div>
        <div className="flex items-start gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Email là bắt buộc' }]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Phân quyền sử dụng"
            name="role"
            initialValue="Thành viên thông thường"
          >
            <Select options={roleOptions} />
          </Form.Item>
        </div>
        {mode === 'create' && (
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[{ required: true, message: 'Mật khẩu là bắt buộc' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
        )}
      </Modal>
    </>
  )
}

export default AccountModalForm
