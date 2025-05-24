'use client'

import { App, Form, Input, Modal, ModalProps, Radio } from 'antd'
import React, { memo } from 'react'
import { editTaskAction } from '../../../action'

type TaskDoneModalFormProps = ModalProps & {
  taskId?: number
  onSubmit?: () => void
  initialValues?: any
  isKeyWorkflow?: boolean
  hasLink?: boolean
  workflowsForProcess?: any
}
const style: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

const TaskDoneModalForm: React.FC<TaskDoneModalFormProps> = ({
  taskId,
  onSubmit,
  initialValues,
  isKeyWorkflow,
  hasLink,
  workflowsForProcess,
  ...rest
}) => {
  const { message } = App.useApp()
  const handleSubmit = async (formData: any) => {
    console.log('đã gọi api')
    try {
      const { errors } = await editTaskAction(taskId || 0, formData)

      if (errors) {
        message.error(errors)
        return
      }

      onSubmit?.()
      message.success(
        isKeyWorkflow
          ? 'Bạn đã hoàn thành task ở giai đoạn này'
          : 'Bạn đã hoàn thành task!',
      )
    } catch (error) {
      throw new Error(String(error))
    }
  }

  const options = workflowsForProcess?.[0]?.workflows?.map((w: any) => ({
    value: w?.id,
    label: w?.name,
  }))

  return (
    <Modal
      title={isKeyWorkflow ? 'Chuyển đến quy trình' : 'Báo cáo sản phẩm'}
      modalRender={(dom) => (
        <Form
          initialValues={initialValues}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {dom}
        </Form>
      )}
      destroyOnClose
      okText="Chuyển tiếp"
      cancelText="Hủy"
      onOk={handleSubmit}
      okButtonProps={{
        htmlType: 'submit',
      }}
      {...rest}
    >
      {hasLink && (
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
        <Form.Item className="mb-[40px]!" name="workflow_id" label="Quy trình">
          <Radio.Group style={style} options={options} />
        </Form.Item>
      )}
    </Modal>
  )
}

export default memo(TaskDoneModalForm)
