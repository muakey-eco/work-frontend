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

export type ProfileWorkHistoryModalFormProps = ModalProps & {
  initialValues?: any
  children?: React.ReactNode
  formProps?: FormProps
  mode?: 'create' | 'edit'
}

const ProfileWorkHistoryModalForm: React.FC<
  ProfileWorkHistoryModalFormProps
> = ({ initialValues, children, formProps, mode = 'create', ...props }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const { message } = App.useApp()
  const router = useRouter()

  const { userId, ...restInitialValues } = initialValues

  const handleSubmit = async (values: any) => {
    setLoading(true)

    const { timestamp, ...rest } = values

    try {
      if (mode === 'create') {
        var { message: msg, errors } = await updateProfileAction(userId, {
          work_history: {
            ...rest,
            start_date: String(
              dayjs(timestamp?.[0]).format('YYYY-MM-DD HH:mm:ss'),
            ),
            end_date: String(
              dayjs(timestamp?.[1]).format('YYYY-MM-DD HH:mm:ss'),
            ),
          },
        })
      } else {
        var { message: msg, errors } = await updateProfileAction(userId, {
          work_history: {
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
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Cập nhật thành công')
      setOpen(false)
      setLoading(false)
      router.refresh()
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
          mode === 'create' ? 'Lịch sử làm việc' : 'Chỉnh sửa lịch sử làm việc'
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
            label="Tên tổ chức, doanh nghiệp"
            name="company_name"
            rules={[
              {
                required: true,
                message: 'Tên tổ chức, doanh nghiệp là bắt buộc',
              },
            ]}
          >
            <Input placeholder="Nhập" />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Thời gian (Bắt đầu - kết thúc)"
            name="timestamp"
            rules={[{ required: true, message: 'Thời gian là bắt buộc' }]}
          >
            <DatePicker.RangePicker className="w-full" locale={locale} />
          </Form.Item>
        </div>

        <Form.Item
          className="mb-0! flex-1"
          label="Vị trí"
          name="position"
          rules={[{ required: true, message: 'Vị trí là bắt buộc' }]}
        ></Form.Item>
      </Modal>
    </>
  )
}

export default ProfileWorkHistoryModalForm
