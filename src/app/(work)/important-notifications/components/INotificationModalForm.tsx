'use client'

import TiptapEditor from '@/components/TiptapEditor'
import { uploadFiles } from '@/libs/data'
import { UploadOutlined } from '@ant-design/icons'
import { App, Button, Form, Input, Modal, Upload } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { createNotificationAction, updateNotificationAction } from '../action'

const INotificationModalForm: React.FC<{
  children: React.ReactNode
  action: 'create' | 'update'
  data?: any
}> = ({ children, action, data }) => {
  const { message } = App.useApp()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [form] = Form.useForm()
  const [fileList, setFileList] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const showModal = () => {
    setIsModalOpen(true)
  }

  const handleUploadChange = ({ fileList: newFileList }: any) => {
    // Validate file type and size
    const file = newFileList[0]?.originFileObj
    if (file) {
      const isImage = file.type.startsWith('image/')
      const isLt2M = file.size / 1024 / 1024 < 2

      if (!isImage) {
        message.error('Chỉ chấp nhận file ảnh!')
        return
      }
      if (!isLt2M) {
        message.error('Kích thước ảnh phải nhỏ hơn 2MB!')
        return
      }
    }
    setFileList(newFileList)
  }

  const handleOk = async () => {
    try {
      setLoading(true)
      const values = await form.validateFields()
      const formData = new FormData()

      // Get the file from fileList if exists
      if (fileList.length > 0 && fileList[0].originFileObj) {
        formData.append('files', fileList[0].originFileObj)
        try {
          const res = await uploadFiles(formData)
          if (!res?.url) {
            throw new Error('Upload ảnh thất bại')
          }
          const thumbnail = res.url

          const finalData = {
            title: values.title,
            message: values.message,
            thumbnail,
          }
          const resNotification =
            action === 'create'
              ? await createNotificationAction(finalData)
              : await updateNotificationAction(data.id, finalData)
          if (resNotification) {
            message.success(
              action === 'create'
                ? 'Tạo thông báo thành công'
                : 'Cập nhật thông báo thành công',
            )
            handleClose()
            router.refresh()
          } else {
            message.error(
              action === 'create'
                ? 'Tạo thông báo thất bại'
                : 'Cập nhật thông báo thất bại',
            )
          }
        } catch (error) {
          message.error('Upload ảnh thất bại')
          return
        }
      } else {
        // Handle case when no image is uploaded
        const finalData = {
          title: values.title,
          message: values.message,
        }
        const resNotification =
          action === 'create'
            ? await createNotificationAction(finalData)
            : await updateNotificationAction(data.id, finalData)
        if (resNotification) {
          message.success(
            action === 'create'
              ? 'Tạo thông báo thành công'
              : 'Cập nhật thông báo thành công',
          )
          handleClose()
          router.refresh()
        } else {
          message.error(
            action === 'create'
              ? 'Tạo thông báo thất bại'
              : 'Cập nhật thông báo thất bại',
          )
        }
      }
    } catch (err) {
      console.error('Validation failed:', err)
      message.error('Có lỗi xảy ra khi tạo thông báo')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setIsModalOpen(false)
    form.resetFields()
    setFileList([])
  }

  const handleCancel = () => {
    handleClose()
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
        footer={null}
      >
        <Form
          layout="vertical"
          className="!mt-4"
          form={form}
          onFinish={handleOk}
          initialValues={data}
        >
          <Form.Item
            label="Tiêu đề"
            name="title"
            required={true}
            className="!mt-4"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Nội dung"
            name="message"
            required={true}
            className="!mt-4"
            rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
          >
            <TiptapEditor
              content={data?.message}
              onChange={(value) => {
                form.setFieldsValue({ message: value })
              }}
            />
          </Form.Item>
          <Form.Item label="Banner" name="thumbnail" className="!mt-4">
            <Upload
              listType="picture"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={() => false} // Prevent auto upload
              maxCount={1}
              accept="image/*"
            >
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
            </Upload>
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={handleCancel} disabled={loading}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              OK
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default INotificationModalForm
