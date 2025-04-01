'use client'

import { App, Form, FormProps, Input, Modal, ModalProps } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { updateProposeAction } from '../action'

type RequestConfirmModalFormProps = ModalProps & {
  children?: React.ReactNode
  initialValues?: FormProps['initialValues']
  status?: 'approved' | 'canceled'
}

const RequestConfirmModalForm: React.FC<RequestConfirmModalFormProps> = ({
  children,
  initialValues,
  status = 'approved',
  ...rest
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()
  const router = useRouter()

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    try {
      var { message: msg, errors } = await updateProposeAction(
        initialValues?.id,
        {
          ...formData,
          status,
        },
      )

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      setLoading(false)
      setOpen(false)
      router.refresh()
      message.success(
        status === 'approved'
          ? 'Duyệt đề xuất thành công'
          : 'Đã từ chối đề xuất',
      )
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Modal
        title={status === 'approved' ? 'Ý kiến phê duyệt' : 'Lý do từ chối'}
        open={open}
        onCancel={() => setOpen(false)}
        okText={
          status === 'approved'
            ? 'Chấp nhận đề xuất này'
            : 'Từ chối đề xuất này'
        }
        cancelText="Hủy bỏ"
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form layout="vertical" onFinish={handleSubmit}>
            {dom}
          </Form>
        )}
        {...rest}
      >
        <Form.Item name="reason">
          <Input.TextArea
            placeholder={status === 'approved' ? 'Gửi ý kiến' : 'Gửi lý do'}
          />
        </Form.Item>
      </Modal>
    </>
  )
}

export default RequestConfirmModalForm
