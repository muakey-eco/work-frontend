'use client'

import { TiptapEditor } from '@/components'
import { App, Button, Form, FormInstance } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { addCommentAction } from './action'

type JobCommentFormProps = {
  options?: any
}

const JobCommentForm: React.FC<JobCommentFormProps> = ({ options }) => {
  const [loading, setLoading] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const router = useRouter()
  const formRef = useRef<FormInstance>(null)
  const { message: messageApi } = App.useApp()

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    const mentions = document.querySelectorAll('span[data-type="mention"]')
    const ids = Array.from(mentions).map((span) => span.getAttribute('data-id'))
    const uniqueIds = [...new Set(ids)]

    try {
      const response = await addCommentAction({
        ...formData,
        task_id: options?.taskId,
        content: formData?.content,
        tags: uniqueIds,
      })

      if (response.errors) {
        messageApi.error(response.message)
        setLoading(false)
        return
      }

      messageApi.success('Bạn vừa thêm bình luận mới.')
      setLoading(false)
      formRef.current?.resetFields()
      router.refresh()
    } catch (error: any) {
      setLoading(false)
      messageApi.error(error?.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  return (
    <Form
      onFinish={handleSubmit}
      ref={formRef}
      onValuesChange={(changedValues) => {
        setDisabled(changedValues?.content?.length === 0)
      }}
    >
      <Form.Item className="mb-[12px]!" name="content" valuePropName="content">
        <TiptapEditor showToolbar={false} />
      </Form.Item>

      <Form.Item className="flex justify-end">
        <Button
          htmlType="submit"
          type="primary"
          disabled={disabled}
          loading={loading}
        >
          Gửi ngay
        </Button>
      </Form.Item>
    </Form>
  )
}

export default JobCommentForm
