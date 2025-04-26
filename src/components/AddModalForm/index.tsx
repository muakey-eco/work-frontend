'use client'

import { addContractCategoryAction } from '@/app/(work)/profile/[id]/(more)/action'
import { App, Form, FormProps, Input, Modal } from 'antd'
import React, { useState } from 'react'

type AddModalFormProps = {
  children: React.ReactNode
  formProps?: FormProps
  title?: string
  label?: string
}

const AddModalForm: React.FC<AddModalFormProps> = ({
  children,
  formProps,
  title,
  label,

  ...props
}) => {
  const { message } = App.useApp()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (values: any) => {
    setLoading(true)
    const res = await addContractCategoryAction(values)
    if (res) {
      message.success(`Thêm hợp đồng thành công`)
      setOpen(false)
    }
    setLoading(false)
  }
  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
      <Modal
        title="Tạo hợp đồng mới"
        open={open}
        okText="Thêm"
        cancelText="Hủy"
        destroyOnClose
        onCancel={() => setOpen(false)}
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form {...formProps} onFinish={handleSubmit}>
            {dom}
          </Form>
        )}
        {...props}
      >
        <Form.Item
          label="Tên hợp đồng"
          name="name"
          rules={[
            { required: true, message: `Tên hợp đồng không được để trống` },
          ]}
        >
          <Input />
        </Form.Item>
      </Modal>
    </>
  )
}

export default AddModalForm
