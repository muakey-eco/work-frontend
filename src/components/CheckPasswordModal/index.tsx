import { App, Button, Form, Input, Modal } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { checkPasswordAction } from './action'

const CheckPasswordModal: React.FC<{
  children: React.ReactNode
  link: string
}> = ({ link, children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const { message } = App.useApp()
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleSubmit = async (values: any) => {
    console.log('values', values)
    const data = {
      password: values.password,
    }
    setLoading(true)
    try {
      const res = await checkPasswordAction(data)
      console.log('res', res)
      if (res.message === 'Mật khẩu chính xác') {
        setIsModalOpen(false)
        router.push(link)
      } else {
        message.error('Mật khẩu không đúng')
      }
    } catch (error) {
      console.log('error', error)
      message.error('Có lỗi xảy ra')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div onClick={showModal}>{children}</div>
      <Modal
        title="Nhập mật khẩu"
        closable={true}
        open={isModalOpen}
        onOk={() => form.submit()}
        onCancel={handleCancel}
        okButtonProps={{ loading }}
        centered
        footer={null}
        destroyOnClose
      >
        <Form layout="vertical" onFinish={handleSubmit} form={form}>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>
          <div className="flex justify-end gap-2">
            <Button type="default" onClick={handleCancel}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Xem phiếu lương
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default CheckPasswordModal
