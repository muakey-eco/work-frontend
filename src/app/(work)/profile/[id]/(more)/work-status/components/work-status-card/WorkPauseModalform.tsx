'use client'

import { TiptapEditor } from '@/components'
import { UploadOutlined } from '@ant-design/icons'
import {
  Alert,
  Button,
  DatePicker,
  Form,
  FormProps,
  Input,
  Modal,
  ModalProps,
  Select,
  Upload,
} from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import React, { useState } from 'react'

export type WorkPauseModalFormProps = ModalProps & {
  children?: React.ReactNode
  formProps?: FormProps
  user?: any
}

const WorkPauseModalForm: React.FC<WorkPauseModalFormProps> = ({
  children,
  formProps,
  user,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const { RangePicker } = DatePicker

  const reasonOptions = [
    {
      label: 'Nghỉ thai sản',
      value: 'pregnancy',
    },
    {
      label: 'Chế độ thai sản cho chồng có vợ sinh con',
      value: 'pregnancy_2',
    },
    {
      label: 'Lý do y tế',
      value: 'medical',
    },
    {
      label: 'Nghỉ tạm thời',
      value: 'temporary',
    },
    {
      label: 'Khác',
      value: 'other',
    },
  ]

  const handleSubmit = (values: any) => {
    console.log(values)
  }

  return (
    <>
      <div className="w-full cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>

      <Modal
        title="Kích hoạt trạng thái tạm nghỉ"
        open={open}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          htmlType: 'submit',
        }}
        onOk={() => setOpen(false)}
        onCancel={() => setOpen(false)}
        destroyOnClose
        width={846}
        modalRender={(dom) => (
          <Form layout="vertical" onFinish={handleSubmit} {...formProps}>
            {dom}
          </Form>
        )}
        {...props}
      >
        <div className="flex items-center gap-[16px]">
          <Form.Item className="mb-[16px]! flex-1" label="Nhân sự" name="staff">
            <Input placeholder={user?.full_name} disabled />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Chức danh"
            name="position"
          >
            <Input placeholder={user?.role} disabled />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Lý do"
            name="reason"
            initialValue="pregnancy"
          >
            <Select options={reasonOptions} />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Thời gian (Bắt đầu - Kết thúc)"
            name="date"
          >
            <RangePicker className="w-full" locale={locale} />
          </Form.Item>
        </div>

        <Alert
          className="!mb-[16px]"
          message="Hệ thống sẽ tự động chuyển nhân sự thành tạm nghỉ và trở lại làm việc khi hết ngày kết thúc"
          type="info"
          showIcon
        />

        <Form.Item className="mb-[16px]!" label="Ghi chú" name="note">
          <TiptapEditor />
        </Form.Item>

        <Form.Item className="mb-0!" label="Tệp đính kèm" name="attachment">
          <Upload>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>
      </Modal>
    </>
  )
}

export default WorkPauseModalForm
