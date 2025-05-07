'use client'

import TiptapEditor from '@/components/TiptapEditor'
import { UploadOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, Upload } from 'antd'
import React, { useState } from 'react'

const INotificationModalForm: React.FC<{
  children: React.ReactNode
  action: 'create' | 'update'
}> = ({ children, action }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleOk = () => {
    setIsModalOpen(false)
  }

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      <div onClick={showModal}>{children}</div>
      <Modal
        title={
          <span className="!text-[16px] font-semibold">
            Tạo thông báo quan trọng
          </span>
        }
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        className="!h-[471px] !w-[798px] !gap-[12px]"
      >
        <Form layout="vertical" className="!mt-4">
          <Form.Item
            label="Tiêu đề"
            name="title"
            required={true}
            className="!mt-4"
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="content"
            required={true}
            className="!mt-4"
          >
            <TiptapEditor />
          </Form.Item>
          <Form.Item label="Banner" name="banner" className="!mt-4">
            <Upload listType="picture">
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default INotificationModalForm
