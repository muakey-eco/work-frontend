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

export type WorkLeaveModalFormProps = ModalProps & {
  children?: React.ReactNode
  formProps?: FormProps
  user?: any
}

const WorkLeaveModalForm: React.FC<WorkLeaveModalFormProps> = ({
  children,
  formProps,
  user,
  ...props
}) => {
  const [open, setOpen] = useState(false)

  const evaluationOptions = [
    {
      label: 'Loại nghỉ tốt',
      value: 'good',
    },
    {
      label: 'Loại nghỉ xấu',
      value: 'bad',
    },
    {
      label: 'Trung bình',
      value: 'average',
    },
  ]

  const reasonOptions = [
    {
      label: 'Chưa xác định',
      value: 'not_determined',
    },
    {
      label: 'Tìm được công việc mới',
      value: 'find_new_job',
    },
    {
      label: 'Lý do cá nhân muốn xin nghỉ',
      value: 'personal_reason',
    },
    {
      label: 'Không đáp ứng được nhu cầu công việc',
      value: 'not_meet_requirements',
    },
    {
      label: 'Bất đồng với tập thể/người quản lý',
      value: 'disagreement_with_team_or_manager',
    },
    {
      label: 'Không phù hợp văn hoá',
      value: 'not_fit_culture',
    },
    {
      label: 'Vi phạm kỷ luật công ty',
      value: 'violate_company_discipline',
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
        title="Thêm quyết định thôi việc"
        open={open}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          htmlType: 'submit',
        }}
        width={846}
        modalRender={(dom) => (
          <Form layout="vertical" onFinish={handleSubmit} {...formProps}>
            {dom}
          </Form>
        )}
        {...props}
      >
        <Alert
          className="!mb-[16px]"
          message="Hành động này sẽ chính thức thôi việc nhân viên ngay lập tức, nếu bạn lựa chọn ngày nghỉ việc trong quá khứ. Vui lòng kiểm tra kỹ thông tin trước khi quyết định."
          type="error"
          showIcon
        />

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
            label="Đánh giá"
            name="evaluation"
            initialValue="good"
          >
            <Select options={evaluationOptions} />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Lý do nghỉ việc"
            name="reason"
            initialValue="not_determined"
          >
            <Select options={reasonOptions} />
          </Form.Item>
        </div>

        <div className="w-[calc(50%-8px)]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Ngày nghỉ việc (ngày làm việc cuối cùng)"
            name="date"
          >
            <DatePicker
              className="w-full"
              locale={locale}
              placeholder="Ngày cấp"
            />
          </Form.Item>
        </div>

        <Form.Item className="mb-[16px]! flex-1" label="Ghi chú" name="note">
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

export default WorkLeaveModalForm
