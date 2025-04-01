'use client'

import { useAsyncEffect } from '@/libs/hook'
import {
  App,
  DatePicker,
  Form,
  FormProps,
  Input,
  Modal,
  ModalProps,
  Radio,
  Select,
} from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { getDepartmentListRequest, updateProfileAction } from '../../../action'

export type JobInfomationModalFormProps = ModalProps & {
  children?: React.ReactNode
  formProps?: FormProps
  initialValues?: any
}

const JobInfomationModalForm: React.FC<JobInfomationModalFormProps> = ({
  children,
  formProps,
  initialValues,
  ...props
}) => {
  const [departmentList, setDepartmentList] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { message } = App.useApp()

  const { department, ...restInitialValues } = initialValues

  const statusOptions = [
    {
      label: 'Chính thức',
      value: 'Chính thức',
    },
    {
      label: 'Thử việc',
      value: 'Thử việc',
    },
  ]

  const staffTypeOptions = [
    {
      label: 'Fulltime',
      value: 'fulltime',
    },
    {
      label: 'Parttime',
      value: 'parttime',
    },
  ]

  const handleSubmit = async (values: any) => {
    setLoading(true)

    try {
      const { message: msg, errors } = await updateProfileAction(
        restInitialValues?.id,
        {
          ...values,
          start_work_date: values.start_work_date
            ? String(dayjs(values.start_work_date)?.format('YYYY-MM-DD'))
            : undefined,
          start_trial_date: values.start_trial_date
            ? String(dayjs(values.start_trial_date)?.format('YYYY-MM-DD'))
            : undefined,
        },
      )

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Cập nhật thành công.')
      setLoading(false)
      setOpen(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  useAsyncEffect(async () => {
    if (!open) return

    const res = await getDepartmentListRequest()

    setDepartmentList(res)
  }, [open])

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
      <Modal
        title="Thông tin công việc"
        open={open}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        width={846}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={{
              ...restInitialValues,
              start_work_date: initialValues?.start_work_date
                ? dayjs(initialValues?.start_work_date)
                : undefined,
              start_trial_date: initialValues?.start_trial_date
                ? dayjs(initialValues?.start_trial_date)
                : undefined,
              staff_type: initialValues?.staff_type || 'fulltime',
              status: initialValues?.status || 'active',
            }}
            {...formProps}
          >
            {dom}
          </Form>
        )}
        {...props}
      >
        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Phòng ban"
            name="department_name"
          >
            <Select
              placeholder="Chọn"
              options={departmentList?.map((d: any) => ({
                label: d?.name,
                value: d?.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Chức danh"
            name="position"
          >
            <Input placeholder="Nhập" />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Trạng thái"
            name="status"
          >
            <Select placeholder="Chọn" options={statusOptions} />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Phân loại nhân sự"
            name="staff_type"
          >
            <Radio.Group options={staffTypeOptions} />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-0! flex-1"
            label="Ngày bắt đầu làm việc"
            name="start_trial_date"
          >
            <DatePicker className="w-full" locale={locale} />
          </Form.Item>

          <Form.Item
            className="mb-0! flex-1"
            label="Ngày chính thức"
            name="start_work_date"
          >
            <DatePicker className="w-full" locale={locale} />
          </Form.Item>
        </div>
      </Modal>{' '}
    </>
  )
}

export default JobInfomationModalForm
