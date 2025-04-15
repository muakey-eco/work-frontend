'use client'

import { TiptapEditor } from '@/components'
import {
  Alert,
  DatePicker,
  Form,
  FormProps,
  Input,
  Modal,
  ModalProps,
  message,
} from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { updateAccountProfileAction } from './action'
export type ScheduleHolidayModalFormProps = ModalProps & {
  children?: React.ReactNode
  formProps?: FormProps
  initialValues?: any
  user?: any
}

const ScheduleHolidayModalForm: React.FC<ScheduleHolidayModalFormProps> = ({
  children,
  formProps,
  initialValues,
  user,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const router = useRouter()

  useEffect(() => {
    if (open && initialValues) {
      form.setFieldsValue({
        ...initialValues,
        effective_date: initialValues?.effective_date
          ? dayjs(initialValues?.effective_date)
          : null,
      })
    }
  }, [initialValues, open, form])

  const handleSubmit = async (values: any) => {
    setLoading(true)
    try {
      const formatDate = (date: any) => date?.format('YYYY-MM-DD') || null
      const formData = {
        dayoff_account: {
          ...values,
          effective_date: formatDate(values.effective_date),
        },
      }

      const res = await updateAccountProfileAction(user?.id, formData)
      if (res) {
        message.success('Cập nhật thành công')
        setOpen(false)
        form.resetFields()
        router.refresh()
      } else {
        message.error(res.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Update error:', error)
      message.error('Có lỗi xảy ra khi cập nhật')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>

      <Modal
        title="Chỉnh sửa dữ liệu ngày phép"
        open={open}
        onCancel={() => setOpen(false)}
        width={846}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form
            onFinish={handleSubmit}
            layout="vertical"
            {...formProps}
            form={form}
          >
            {dom}
          </Form>
        )}
        {...props}
      >
        <div className="flex items-center gap-[16px]">
          <Form.Item className="mb-[16px]! flex-1" label="Nhân sự" name="staff">
            <Input placeholder="Nhập" disabled />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Ngày có hiệu lực"
            name="effective_date"
          >
            <DatePicker className="w-full" locale={locale} />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Tổng ngày phép có hưởng lương"
            name="total_holiday_with_salary"
          >
            <Input placeholder="Nhập" />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Phép thâm niên"
            name="seniority_holiday"
          >
            <Input placeholder="Nhập" />
          </Form.Item>
        </div>

        <Alert
          className="mb-[16px]!"
          message={
            <span>
              Tổng ngày phép:{' '}
              <span className="font-[600]">
                {Number(initialValues?.total_holiday_with_salary) +
                  Number(initialValues?.seniority_holiday)}
              </span>{' '}
              ngày
            </span>
          }
          type="success"
          showIcon
          closable
        />

        <Form.Item className="mb-[16px]! flex-1" label="Ghi chú" name="note">
          <TiptapEditor />
        </Form.Item>
      </Modal>
    </>
  )
}

export default ScheduleHolidayModalForm
