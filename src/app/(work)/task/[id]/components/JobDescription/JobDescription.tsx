'use client'

import { TiptapEditor } from '@/components'
import { App, Button, Form, Modal } from 'antd'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { editTaskAction } from '../../../actions'

type JobDescriptionProps = {
  value?: any
  params?: any
}

const JobDescription: React.FC<JobDescriptionProps> = ({
  value: defaultValue,
  params,
}) => {
  const [value, setValue] = useState(defaultValue || '')
  const [isEdit, setIsEdit] = useState(false)
  const [loading, setLoading] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewOpen, setPreviewOpen] = useState(false)
  const { message } = App.useApp()
  const router = useRouter()
  const handleSubmit = async (formData: any) => {
    setLoading(true)

    try {
      const { message, errors } = await editTaskAction(params?.task?.id, {
        description: formData?.description,
      })

      if (errors) {
        message.error(message)
        setLoading(false)
        return
      }

      message.success('Cập nhật thành công')
      router.refresh()
      setIsEdit(false)
      setLoading(false)
      setValue(formData?.description)
    } catch (error: any) {
      setLoading(false)
      throw new Error(error)
    }
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'IMG') {
      setPreviewImage(target.getAttribute('src') || '')
      setPreviewOpen(true)
    }
  }

  return (
    <div className="mt-[24px]">
      <div className="flex items-center justify-between gap-[24px]">
        <div className="text-[12px] font-[500] text-[#42b814]">MÔ TẢ</div>
        <span
          className="cursor-pointer text-[13px] text-[#267cde] hover:underline"
          onClick={() => setIsEdit(!isEdit)}
        >
          Chỉnh sửa
        </span>
      </div>
      {isEdit ? (
        <Form
          className="!mt-[16px]"
          onFinish={handleSubmit}
          initialValues={{ description: value || '' }}
        >
          <Form.Item
            rootClassName="!mb-[16px]"
            name="description"
            valuePropName="content"
          >
            <TiptapEditor placeholder="Mô tả nhiệm vụ" />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary" loading={loading}>
              Cập nhật
            </Button>
            <Button
              className="ml-[8px]"
              variant="outlined"
              onClick={() => setIsEdit(false)}
            >
              Bỏ qua
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <div
          className={clsx(
            'prose mt-[8px] max-w-full!',
            value ? 'text-[#333]' : 'text-[#999]',
          )}
          dangerouslySetInnerHTML={{ __html: value || 'Không có mô tả' }}
          onClick={handleImageClick}
        />
      )}

      <Modal
        open={previewOpen}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        width="95%"
        height="90%"
        centered
        closable={false}
      >
        <img
          alt="preview"
          style={{ maxWidth: '100%', borderRadius: '8px' }}
          src={previewImage}
        />
      </Modal>
    </div>
  )
}

export default JobDescription
