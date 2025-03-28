'use client'

import { App, Form, Input, Modal, ModalProps, Select } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import {
  addDepartmentAction,
  updateDepartmentAction,
} from './department-list/action'

type DepartmentModalFormProps = ModalProps & {
  children?: React.ReactNode
  action?: 'create' | 'edit'
  options?: any
}

const DepartmentModalForm: React.FC<DepartmentModalFormProps> = ({
  children,
  action = 'create',
  options,
  ...rest
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()
  const router = useRouter()

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    try {
      if (action === 'create') {
        var { message: msg, errors } = await addDepartmentAction(formData)
      } else {
        var { message: msg, errors } = await updateDepartmentAction(
          Number(options?.id),
          formData,
        )
      }

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success(
        action === 'create' ? 'Thêm thành công' : 'Cập nhật thành công',
      )
      setLoading(false)
      setOpen(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      <Modal
        title={action === 'create' ? 'Tạo phòng ban mới' : 'Cập nhật phòng ban'}
        open={open}
        onCancel={() => setOpen(false)}
        okText={action === 'create' ? 'Tạo mới' : 'Cập nhật'}
        cancelText="Quay lại"
        destroyOnClose
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form
            onFinish={handleSubmit}
            layout="vertical"
            initialValues={options?.initialValues}
          >
            {dom}
          </Form>
        )}
        {...rest}
      >
        <Form.Item name="name" label="Tên phòng ban">
          <Input placeholder="Nhập tên phòng ban" />
        </Form.Item>

        <Form.Item name="members" label="Thành viên">
          <Select
            placeholder="Chọn thành viên"
            mode="multiple"
            options={options?.members?.map((member: any) => ({
              label: member?.full_name,
              value: member?.username,
            }))}
            allowClear
          />
        </Form.Item>
      </Modal>
    </>
  )
}

export default DepartmentModalForm
