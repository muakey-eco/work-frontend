'use client'

import { TiptapEditor } from '@/components'
import { getAccountsAsAttendance } from '@/libs/data'
import { useAsyncEffect } from '@/libs/hook'
import { App, DatePicker, Form, Input, Modal, Select } from 'antd'

import { FormProps, ModalProps } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'
import { addAssetAction } from '../action'

export type AssetModalFormProps = ModalProps & {
  children?: React.ReactNode
  initialValues?: any
  formProps?: FormProps
}

const AssetModalForm: React.FC<AssetModalFormProps> = ({
  children,
  initialValues,
  formProps,
  ...props
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState<any>([])

  const router = useRouter()
  const { message } = App.useApp()

  const handleSubmit = async (values: any) => {
    setLoading(true)

    try {
      const { message: msg, errors } = await addAssetAction(values)

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Thêm tài sản thành công')
      setOpen(false)
      setLoading(false)
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(error as string)
    }
  }

  const statusOptions = [
    { label: 'Đang sử dụng', value: 'using' },
    { label: 'Chưa sử dụng', value: 'unused' },
    { label: 'Đã thanh lý', value: 'liquidated' },
    { label: 'Đang bảo hành', value: 'warranty' },
    { label: 'Hỏng', value: 'broken' },
  ]

  const assetTypeOptions = [
    { label: 'Máy tính', value: 'computer' },
    { label: 'Điện thoại', value: 'phone' },
    { label: 'Máy ảnh', value: 'camera' },
    { label: 'Máy nghe nhạc', value: 'music' },
  ]

  const userOptions = useMemo(() => {
    return users.map((user: any) => ({
      label: user?.full_name,
      value: user?.id,
    }))
  }, [users])

  useAsyncEffect(async () => {
    const res = await getAccountsAsAttendance()

    setUsers(res)
  }, [])

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
      <Modal
        title="Thêm mới tài sản"
        open={open}
        onCancel={() => setOpen(false)}
        okText="Lưu"
        cancelText="Hủy"
        width={846}
        destroyOnClose
        okButtonProps={{
          htmlType: 'submit',
          className: 'w-[120px]',
          loading,
        }}
        cancelButtonProps={{
          className: 'w-[120px]',
        }}
        modalRender={(dom) => (
          <Form layout="vertical" onFinish={handleSubmit} {...formProps}>
            {dom}
          </Form>
        )}
        {...props}
      >
        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            name="name"
            label="Tên tài sản"
            rules={[{ required: true, message: 'Tên tài sản là bắt buộc' }]}
          >
            <Input placeholder="Nhập tên tài sản" />
          </Form.Item>
          <Form.Item
            className="mb-[16px]! flex-1"
            name="code"
            label="Mã tài sản"
            rules={[{ required: true, message: 'Mã tài sản là bắt buộc' }]}
          >
            <Input placeholder="Nhập mã tài sản" />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Trạng thái là bắt buộc' }]}
          >
            <Select options={statusOptions} placeholder="Chọn trạng thái" />
          </Form.Item>
          <Form.Item
            className="mb-[16px]! flex-1"
            name="asset_category_id"
            label="Loại tài sản"
            rules={[{ required: true, message: 'Loại tài sản là bắt buộc' }]}
          >
            <Select
              options={assetTypeOptions}
              placeholder="Chọn loại tài sản"
            />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            name="serial_number"
            label="Số Serial"
          >
            <Input placeholder="Nhập số Serial" />
          </Form.Item>
          <Form.Item
            className="mb-[16px]! flex-1"
            name="account_id"
            label="Người sử dụng"
          >
            <Select placeholder="Chọn người sử dụng" options={userOptions} />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            name="start_date"
            label="Ngày bắt đầu sử dụng"
          >
            <DatePicker className="w-full" locale={locale} />
          </Form.Item>
          <Form.Item
            className="mb-[16px]! flex-1"
            name="time_used"
            label="Thời gian sử dụng"
          >
            <Input placeholder="Tự động tính từ lúc đổi trạng thái" disabled />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            name="brand"
            label="Tên nhà cung cấp"
          >
            <Input placeholder="Nhập tên nhà cung cấp" />
          </Form.Item>
          <Form.Item
            className="mb-[16px]! flex-1"
            name="brand_link"
            label="Link nhà cung cấp"
          >
            <Input placeholder="Nhập link nhà cung cấp" />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item className="mb-[16px]! flex-1" name="price" label="Giá mua">
            <Input placeholder="Nhập giá mua" />
          </Form.Item>
          <Form.Item
            className="mb-[16px]! flex-1"
            name="buy_date"
            label="Ngày mua"
          >
            <DatePicker className="w-full" locale={locale} />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            name="warranty_date"
            label="Hạn bảo hành"
          >
            <DatePicker className="w-full" locale={locale} />
          </Form.Item>
          <Form.Item
            className="mb-[16px]! flex-1"
            name="buyer_id"
            label="Người mua"
          >
            <Select placeholder="Chọn người mua" options={userOptions} />
          </Form.Item>
        </div>

        <div className="flex items-center gap-[16px]">
          <Form.Item
            className="mb-[16px]! flex-1"
            name="sell_date"
            label="Ngày thanh lý"
          >
            <DatePicker className="w-full" locale={locale} disabled />
          </Form.Item>
          <Form.Item
            className="mb-[16px]! flex-1"
            name="sell_price"
            label="Giá thanh lý"
          >
            <Input placeholder="Nhập giá thanh lý" disabled />
          </Form.Item>
        </div>

        <Form.Item
          className="mb-[16px]! flex-1"
          name="seller_id"
          label="Người thanh lý"
        >
          <Select
            placeholder="Chọn người thanh lý"
            options={userOptions}
            disabled
          />
        </Form.Item>

        <Form.Item className="mb-0! flex-1" name="description" label="Ghi chú">
          <TiptapEditor />
        </Form.Item>
      </Modal>
    </>
  )
}
export default AssetModalForm
