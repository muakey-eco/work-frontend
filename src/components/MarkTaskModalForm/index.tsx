'use client'

import { App, Form, FormInstance, Input, Modal, ModalProps, Radio } from 'antd'
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
  requireLink?: boolean
}

const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

const MarkTaskModalForm: React.FC<ModalProps & MarkTaskModalFormProps> = ({
  children,
  options,
  mark = 'failed',
  requireLink = false,
  ...rest
}) => {
  const [markOpen, setMarkOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false)
  const [currentTimeDifference, setCurrentTimeDifference] = useState(0)
  const [customStartedAt, setCustomStartedAt] = useState<dayjs.Dayjs | null>(
    null,
  )
  const formRef = useRef<FormInstance>(null)
  const router = useRouter()

  const { stageId, task, workflowsForProcess, isKeyWorkflow } = options
  const { message, modal } = App.useApp()

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    try {
      if (mark === 'completed') {
        await editTaskAction(task?.id, formData)
      }

      setMarkOpen(false)
      setIsTimeModalOpen(true)
      setLoading(false)
      message.success('Đánh dấu hoàn thành.')
      router.refresh()
    } catch (error: any) {
      setLoading(false)
      throw new Error(error)
    }
  }

  const handleMarkCompleted = async (formData: any) => {
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
        setIsTimeModalOpen(true)
        return
      }

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

      setIsTimeModalOpen(false)
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
      if (!customStartedAt) {
        message.error('Vui lòng chọn thời gian')
        return
      }

      if (customStartedAt.isBefore(dayjs())) {
        message.error('Thời gian không được nhỏ hơn hiện tại')
        return
      }

      const { errors } = await moveStageAction(task?.id, stageId, {
        started_at: customStartedAt.toISOString(),
      })

      if (errors) {
        message.error(errors)
        setLoading(false)
        return
      }

      setIsTimeModalOpen(false)
      setCustomStartedAt(null) // ✅ reset
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
    setCustomStartedAt(null)
  }
  const optionsValue = workflowsForProcess?.[0]?.workflows?.map((w: any) => ({
    value: w?.id,
    label: w?.name,
  }))

  if (isTimeModalOpen && mark === 'completed') {
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
          value={customStartedAt}
          onTimeChange={(value) => {
            setCustomStartedAt(value)
          }}
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
            <>
              {requireLink && (
                <Form.Item
                  className="mb-[40px]!"
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
              {isKeyWorkflow && (
                <Form.Item
                  className="mb-[40px]!"
                  name="workflow_id"
                  label="Quy trình"
                >
                  <Radio.Group style={style} options={optionsValue} />
                </Form.Item>
              )}
            </>
          )}
        </Form>
      </Modal>
    </>
  )
}

export default MarkTaskModalForm
