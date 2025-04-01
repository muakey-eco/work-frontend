'use client'

import { App, Form, FormInstance, Input, Modal } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { editTaskAction } from '../action'
import { moveStageAction } from './action'

type MarkTaskModalFormProps = {
  children?: React.ReactNode
  options?: any
  mark?: 'failed' | 'completed'
  reportRequired?: boolean
}

const MarkTaskModalForm: React.FC<MarkTaskModalFormProps> = ({
  children,
  options,
  mark = 'failed',
  reportRequired = false,
}) => {
  const [markOpen, setMarkOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const formRef = useRef<FormInstance>(null)
  const router = useRouter()

  const { stageId, task } = options
  const { message, modal } = App.useApp()

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    try {
      if (mark === 'failed') {
        var { errors } = await moveStageAction(task?.id, stageId, formData)
      } else {
        var { errors } = await moveStageAction(task?.id, stageId)
      }

      if (errors) {
        message.error(errors)
        setLoading(false)
        return
      }

      if (mark === 'completed' && !errors) {
        await editTaskAction(task?.id, formData)
      }

      setMarkOpen(false)
      setLoading(false)
      message.success('Đánh dấu hoàn thành.')
      router.refresh()
    } catch (error: any) {
      setLoading(false)
      throw new Error(error)
    }
  }

  const handleMarkCompleted = async () => {
    try {
      var { errors } = await moveStageAction(task?.id, stageId)

      if (errors) {
        message.error(errors)
        setLoading(false)
        return
      }

      setMarkOpen(false)
      setLoading(false)
      message.success('Đã đánh dấu hoàn thành.')
      router.refresh()
    } catch (error: any) {
      setLoading(false)
      throw new Error(error)
    }
  }

  if (!reportRequired && mark === 'completed') {
    return (
      <div
        onClick={() => {
          modal.confirm({
            title: 'Xác nhận nhiệm vụ hoàn thành?',
            onOk: handleMarkCompleted,
          })
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <>
      <div onClick={() => setMarkOpen(true)}>{children}</div>
      <Modal
        title={`ĐÁNH DẤU NHIỆM VỤ ${mark === 'failed' ? 'THẤT BẠI' : 'HOÀN THÀNH'}`}
        open={markOpen}
        onCancel={() => setMarkOpen(false)}
        onOk={() => formRef.current?.submit()}
        width={590}
        okText={`Đánh dấu ${mark === 'failed' ? 'thất bại' : 'hoàn thành'}`}
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        destroyOnClose
      >
        <Form
          onFinish={handleSubmit}
          ref={formRef}
          initialValues={{
            name: task?.name,
            link_youtube: task?.link_youtube,
          }}
          layout="vertical"
        >
          {mark === 'failed' ? (
            <>
              <Form.Item name="name" label="Tên luồng công việc">
                <Input placeholder="Tên luồng công việc" disabled />
              </Form.Item>
              <Form.Item
                name="reason"
                label="Lý do thất bại"
                rules={[
                  {
                    required: true,
                    message: 'Nhập lý do thất bại.',
                  },
                ]}
              >
                <Input placeholder="Lý do thất bại" />
              </Form.Item>
            </>
          ) : (
            <Form.Item
              name="link_youtube"
              label="Link sản phẩm"
              rules={[
                {
                  required: true,
                  message: 'Nhập link sản phẩm',
                },
              ]}
            >
              <Input />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </>
  )
}

export default MarkTaskModalForm
