'use client'

import { useAsyncEffect } from '@/libs/hook'
import { randomColor } from '@/libs/utils'
import { EditOutlined, UserOutlined } from '@ant-design/icons'
import {
  App,
  Avatar,
  Form,
  Input,
  Modal,
  Select,
  SelectProps,
  Upload,
} from 'antd'
import { UploadChangeParam } from 'antd/es/upload'
import { UploadFile } from 'antd/lib'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import {
  addAccountAction,
  editAccountAction,
  getRolesRequest,
  uploadImageAction,
} from './action'

type AccountModalFormProps = {
  children?: React.ReactNode
  action?: 'create' | 'edit'
  initialValues?: any
}

const AccountModalForm: React.FC<AccountModalFormProps> = ({
  children,
  action = 'create',
  initialValues,
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [roles, setRoles] = useState([])

  const [avatar, setAvatar] = useState<any>({
    url: '',
    preview: '',
  })

  const { message } = App.useApp()
  const router = useRouter()

  const { id, email } = initialValues || {}

  const handlUpload = async (info: UploadChangeParam<UploadFile<any>>) => {
    const { file } = info

    const formData = new FormData()
    formData.append('image', file.originFileObj || '')

    try {
      const { urlImage, error } = await uploadImageAction(formData)

      if (error) {
        message.error(error)
        return
      }

      setAvatar({
        url: urlImage,
        preview: file.originFileObj
          ? URL.createObjectURL(file.originFileObj)
          : '',
      })
    } catch (error) {
      throw new Error(String(error))
    }
  }

  const handleSubmit = async (formData: any) => {
    const { email: formEmail, ...restFormData } = formData

    setLoading(true)

    try {
      if (action === 'create') {
        var { message: msg, errors } = await addAccountAction({
          ...formData,
          avatar: avatar?.url,
        })
      } else {
        var { message: msg, errors } = await editAccountAction(id, {
          ...restFormData,
          ...(formEmail === email ? {} : { email: formEmail }),
          avatar: avatar?.url || initialValues?.avatar,
        })
      }

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success(
        action === 'create' ? 'Thêm thành công' : 'Sửa thành công',
      )
      setLoading(false)
      setOpen(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  useAsyncEffect(async () => {
    if (!open) return

    const data = await getRolesRequest()

    setRoles(data)
  }, [open])

  const roleOptions: SelectProps['options'] = roles?.map((r: any) => ({
    label: r?.name,
    value: r?.id,
  }))

  useEffect(() => {
    return () => avatar.preview && URL.revokeObjectURL(avatar.preview)
  }, [avatar])

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
      <Modal
        title={
          action === 'create' ? 'Thêm mới tài khoản' : 'Cập nhật tài khoản'
        }
        open={open}
        onCancel={() => setOpen(false)}
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              ...initialValues,
              day_off: initialValues?.day_off || 0,
              role_id: initialValues?.role_id || 1,
            }}
          >
            {dom}
          </Form>
        )}
        width={680}
        destroyOnClose
      >
        <div className="flex items-start gap-[24px]">
          <Upload onChange={handlUpload} showUploadList={false}>
            <div className="flex cursor-pointer items-end">
              <Avatar
                src={avatar?.preview || initialValues?.avatar}
                icon={action === 'create' ? <UserOutlined /> : undefined}
                style={
                  action !== 'create'
                    ? {
                        backgroundColor: randomColor(
                          String(initialValues?.full_name),
                        ),
                      }
                    : undefined
                }
                size={60}
              >
                {String(initialValues?.full_name).charAt(0).toUpperCase()}
              </Avatar>
              <EditOutlined />
            </div>
          </Upload>
          <Form.Item
            className="flex-1"
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập email',
              },
            ]}
          >
            <Input />
          </Form.Item>
        </div>
        <div className="flex items-center gap-[24px]">
          <Form.Item className="flex-1" name="full_name" label="Họ và tên">
            <Input />
          </Form.Item>
          <Form.Item className="flex-1" name="phone" label="Số điện thoại">
            <Input />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[24px]">
          <Form.Item className="flex-1" name="role_id" label="Phân quyền">
            <Select options={roleOptions} />
          </Form.Item>
          <Form.Item
            className="flex-1"
            name="day_off"
            label="Ngày phép có lương"
          >
            <Input placeholder="Nhập số ngày" />
          </Form.Item>
        </div>

        {action === 'create' && (
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu',
              },
              {
                min: 6,
                message: 'Mật khẩu chứa ít nhất 6 ký tự',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        )}
      </Modal>
    </>
  )
}

export default AccountModalForm
