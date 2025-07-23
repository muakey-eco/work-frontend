'use client'

import { App, Form, Input, Modal } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { createChannelAction } from '../action'

const ChannelModal: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()
  const router = useRouter()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = async (formData: any) => {
    setLoading(true)
    const playlistArray = formData.playlist.split(',')
    try {
      await createChannelAction({
        ...formData,
        playlist: playlistArray,
      })
      message.success('Thêm kênh thành công')
      setIsModalOpen(false)
      form.resetFields()
      router.refresh()
    } catch (error) {
      message.error('Thêm kênh thất bại')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const onSubmit = () => {
    form.submit()
  }

  return (
    <>
      <div className="cursor-pointer" onClick={showModal}>
        {children}
      </div>
      <Modal
        closable={true}
        maskClosable={false}
        open={isModalOpen}
        onOk={onSubmit}
        onCancel={handleCancel}
        okText="Thêm"
        cancelText="Hủy"
        okButtonProps={{ loading, disabled: loading }}
        title={
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold">Thêm kênh</span>
          </div>
        }
      >
        <Form
          form={form}
          layout="horizontal"
          onFinish={handleOk}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18 }}
          labelAlign="left"
        >
          <Form.Item
            label="Tên kênh"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên kênh' }]}
          >
            <Input placeholder="Nhập tên kênh" />
          </Form.Item>
          <Form.Item
            label="Tiêu đề kênh"
            name="default_title"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề kênh' }]}
          >
            <Input placeholder="Nhập tiêu đề kênh" />
          </Form.Item>
          <Form.Item
            label="Danh sách phát"
            name="playlist"
            rules={[
              { required: true, message: 'Vui lòng nhập danh sách phát' },
            ]}
          >
            <Input placeholder="Nhập danh sách phát playlist1,playlist2,playlist3" />
          </Form.Item>
          <Form.Item
            label="Tag mặc định"
            name="default_tags"
            rules={[{ required: true, message: 'Vui lòng nhập tag mặc định' }]}
          >
            <Input placeholder="Nhập tag mặc định" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default ChannelModal
