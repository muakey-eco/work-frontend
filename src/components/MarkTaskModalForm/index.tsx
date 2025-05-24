'use client'

import { App, Form, FormInstance, Input, Modal, ModalProps } from 'antd'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { editTaskAction } from '../action'
import TimeConfirmationModal from '../TimeConfirmationModal'
import { moveStageAction } from './action'

type MarkTaskModalFormProps = {
  children?: React.ReactNode
  options?: any
  mark?: 'failed' | 'completed'
  reportRequired?: boolean
}

const MarkTaskModalForm: React.FC<ModalProps & MarkTaskModalFormProps> = ({
  children,
  options,
  mark = 'failed',
  reportRequired = false,
  ...rest
}) => {
  const [markOpen, setMarkOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)
  const [currentTimeDifference, setCurrentTimeDifference] = useState(0)
  const [currentStartedAt, setCurrentStartedAt] = useState<any>(null)
  const formRef = useRef<FormInstance>(null)
  const router = useRouter()

  const { stageId, task } = options
  const { message, modal } = App.useApp()

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    try {
      let result
      if (mark === 'failed') {
        result = await moveStageAction(task?.id, stageId, formData)
      } else {
        result = await moveStageAction(task?.id, stageId)
      }

      if (result.errors) {
        const errorMessage =
          typeof result.errors === 'object'
            ? result.errors.task || 'Có lỗi xảy ra'
            : result.errors
        message.error(String(errorMessage))
        setLoading(false)
        return
      }

      if (mark === 'completed' && !result.errors) {
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
      const startedAt = dayjs(task?.started_at)
      if (!startedAt.isValid()) {
        message.error('Nhiệm vụ chưa được bắt đầu.')
        return
      }

      const currentTime = dayjs()
      const timeDifference = currentTime.diff(startedAt, 'minutes') || 0 // in minutes

      // If the time difference is less than 5 minutes, show the confirmation modal
      if (timeDifference < 5) {
        setCurrentTimeDifference(timeDifference)
        setCurrentStartedAt(startedAt)
        setIsTimeModalOpen(true)
        return
      }

      var { errors } = await moveStageAction(task?.id, stageId)

      if (errors) {
        message.error(String(errors.task || 'Có lỗi xảy ra'))
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

  const handleTimeConfirm = async () => {
    try {
      var { errors } = await moveStageAction(task?.id, stageId)

      if (errors) {
        message.error(errors)
        setLoading(false)
        return
      }

      setIsTimeModalOpen(false)
      setMarkOpen(false)
      setLoading(false)
      message.success('Đã đánh dấu hoàn thành.')
      router.refresh()
    } catch (error: any) {
      setLoading(false)
      throw new Error(error)
    }
  }

  const handleTimeCancel = () => {
    setIsTimeModalOpen(false)
  }

  if (!reportRequired && mark === 'completed') {
    return (
      <>
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

        <TimeConfirmationModal
          open={isTimeModalOpen}
          onOk={handleTimeConfirm}
          onCancel={handleTimeCancel}
          currentTimeDifference={currentTimeDifference}
          currentStartedAt={currentStartedAt}
        />
      </>
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
        {...rest}
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
