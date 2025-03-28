'use client'

import {
  App,
  DatePicker,
  Form,
  FormProps,
  Input,
  Modal,
  ModalProps,
} from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { updateProfileAction } from '../action'

export type ProfileEduInfomationModalFormProps = ModalProps & {
  initialValues?: any
  children?: React.ReactNode
  formProps?: FormProps
  mode?: 'create' | 'edit'
}

const ProfileEduInfomationModalForm: React.FC<
  ProfileEduInfomationModalFormProps
> = ({ initialValues, children, formProps, mode = 'create', ...props }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const { message } = App.useApp()

  const { userId, ...restInitialValues } = initialValues

  const handleSubmit = async (values: any) => {
    const { timestamp, ...rest } = values

    setLoading(true)

    try {
      if (mode === 'create') {
        var { message: msg, errors } = await updateProfileAction(
          restInitialValues?.id,
          {
            education: {
              ...rest,
              start_date: String(
                dayjs(timestamp?.[0]).format('YYYY-MM-DD HH:mm:ss'),
              ),
              end_date: String(
                dayjs(timestamp?.[1]).format('YYYY-MM-DD HH:mm:ss'),
              ),
            },
          },
        )
      } else {
        var { message: msg, errors } = await updateProfileAction(userId, {
          education: {
            ...rest,
            id: initialValues?.id,
            start_date: String(
              dayjs(timestamp?.[0]).format('YYYY-MM-DD HH:mm:ss'),
            ),
            end_date: String(
              dayjs(timestamp?.[1]).format('YYYY-MM-DD HH:mm:ss'),
            ),
          },
        })
      }

      if (errors) {
        setLoading(false)
        message.error(msg)
        return
      }

      router.refresh()
      setOpen(false)
      message.success('Cập nhật thông tin thành công')
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>

      <Modal
        title={
          mode === 'create'
            ? 'Thông tin học vấn'
            : 'Chỉnh sửa thông tin học vấn'
        }
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        okText="Lưu"
        cancelText="Hủy"
        width={846}
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form
            layout="vertical"
            onFinish={handleSubmit}
            initialValues={restInitialValues}
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
            label="Trường học"
            name="school_name"
            rules={[{ required: true, message: 'Trường học là bắt buộc' }]}
          >
            <Input placeholder="Nhập" />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Chuyên ngành"
            name="major"
            rules={[{ required: true, message: 'Chuyên ngành là bắt buộc' }]}
          >
            <Input placeholder="Nhập" />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-0! flex-1"
            label="Thời gian (Bắt đầu - kết thúc)"
            name="timestamp"
            rules={[{ required: true, message: 'Thời gian là bắt buộc' }]}
          >
            <DatePicker.RangePicker className="w-full" locale={locale} />
          </Form.Item>

          <Form.Item
            className="mb-0! flex-1"
            label="Bằng cấp"
            name="degree"
            rules={[{ required: true, message: 'Bằng cấp là bắt buộc' }]}
          >
            <Input placeholder="Nhập" />
          </Form.Item>
        </div>
      </Modal>
    </>
  )
}

export default ProfileEduInfomationModalForm
