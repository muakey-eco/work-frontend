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
  RadioGroupProps,
  Select,
  SelectProps,
} from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { getBankListRequest, updateProfileAction } from '../action'

export type ProfileInfomationModalFormProps = ModalProps & {
  initialValues?: any
  children?: React.ReactNode
  formProps?: FormProps
}

const ProfileInfomationModalForm: React.FC<ProfileInfomationModalFormProps> = ({
  children,
  initialValues,
  formProps,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bankList, setBankList] = useState<any[]>([])
  const router = useRouter()

  const { message } = App.useApp()

  const genderOptions: RadioGroupProps['options'] = [
    { label: 'Nam', value: 'Nam' },
    { label: 'Nữ', value: 'Nữ' },
  ]

  const maritalStatusOptions: SelectProps['options'] = [
    { label: 'Độc thân', value: 'single' },
    { label: 'Đã kết hôn', value: 'married' },
  ]

  const bankOptions: SelectProps['options'] = bankList.map((bank) => ({
    label: bank?.shortName,
    value: bank?.shortName,
  }))

  const handleSubmit = async (values: any) => {
    setLoading(true)

    try {
      const { message: msg, errors } = await updateProfileAction(
        initialValues?.id,
        {
          ...values,
          birthday: values?.birthday
            ? String(dayjs(values?.birthday)?.format('YYYY-MM-DD'))
            : null,
        },
      )

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

  useAsyncEffect(async () => {
    if (!open) return

    const res = await getBankListRequest()

    const { data } = res

    setBankList(data)
  }, [open])

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>

      <Modal
        title="Chỉnh sửa thông tin cá nhân"
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
            initialValues={{
              ...initialValues,
              birthday: initialValues?.birthday
                ? dayjs(initialValues?.birthday)
                : null,
              name_bank: initialValues?.name_bank || 'VietinBank',
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
            label="Họ và tên"
            name="full_name"
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item className="mb-[16px]! flex-1" label="Email" name="email">
            <Input disabled />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Tài khoản"
            name="username"
            rules={[{ required: true, message: 'Tài khoản là bắt buộc' }]}
          >
            <Input placeholder="Nhập tài khoản" />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Số điện thoại"
            name="phone"
          >
            <Input placeholder="Nhập số điện thoại" />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Ngày tháng năm sinh"
            name="birthday"
          >
            <DatePicker className="w-full" locale={locale} />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Giới tính"
            name="gender"
          >
            <Radio.Group options={genderOptions} />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="CCCD"
            name="identity_card"
          >
            <Input placeholder="Nhập số CCCD" />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Email cá nhân"
            name="personal_email"
          >
            <Input placeholder="Nhập email cá nhân" />
          </Form.Item>
        </div>

        <Form.Item
          className="mb-[16px]! flex-1"
          label="Địa chỉ thường trú"
          name="address"
        >
          <Input placeholder="Nhập địa chỉ thường trú" />
        </Form.Item>

        <Form.Item
          className="mb-[16px]! flex-1"
          label="Địa chỉ liên hệ"
          name="contact_address"
        >
          <Input placeholder="Nhập địa chỉ liên hệ" />
        </Form.Item>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            label="Hộ chiếu"
            name="passport"
          >
            <Input placeholder="Nhập hộ chiếu" />
          </Form.Item>

          <Form.Item
            className="mb-[16px]! flex-1"
            label="Tình trạng hôn nhân"
            name="marital_status"
          >
            <Select options={maritalStatusOptions} />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-0! flex-1"
            name="name_bank"
            label="Ngân hàng"
          >
            <Select
              showSearch
              options={bankOptions}
              placeholder="Chọn ngân hàng"
              filterOption={(input, option) =>
                String(option?.label ?? '')
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
            />
          </Form.Item>
          <Form.Item
            className="mb-0! flex-1"
            name="bank_number"
            label="Số tài khoản"
          >
            <Input placeholder="Nhập số tài khoản ngân hàng" />
          </Form.Item>
        </div>
      </Modal>
    </>
  )
}

export default ProfileInfomationModalForm
