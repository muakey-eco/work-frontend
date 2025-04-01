'use client'

import BrandFormItems from '@/components/BrandFormItem'
import CategoryFormItems from '@/components/CategoryFormItem'
import AssetUserFormItem from '@/components/UserFormItem'
import { CloseOutlined } from '@ant-design/icons'
import {
  Button,
  Drawer,
  Form,
  FormProps,
  Input,
  ModalProps,
  Select,
} from 'antd'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAssetForm } from '../../hooks/useAssetForm'

export type AssetDrawerProps = ModalProps & {
  children: React.ReactNode
  formProps?: FormProps<any>
}

const AssetDrawer: React.FC<AssetDrawerProps> = ({
  children,
  formProps,
  ...modalProps
}) => {
  const [form] = Form.useForm()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { statusOptions } = useAssetForm()

  const searchParams = useSearchParams()
  const statusFromUrl = searchParams.get('status')

  const router = useRouter()
  const handleCancel = () => {
    setOpen(false)
  }

  useEffect(() => {
    form.setFieldsValue({ status: statusFromUrl || undefined })
  }, [statusFromUrl]) // Cập nhật giá trị khi URL thay đổi

  const handleFilter = async () => {
    const values = await form.validateFields()

    setLoading(true)
    if (Object.values(values).every((value) => value === undefined)) {
      router.push(`/asset`)
      setLoading(false)
      setOpen(false)
      return
    }

    try {
      // Bỏ giá trị null, undefined, chuỗi rỗng
      const filteredValues = Object.fromEntries(
        Object.entries(values).filter(
          ([_, value]) => value !== undefined && value !== null && value !== '',
        ),
      )

      const currentParams = new URLSearchParams()

      // Add filtered values to params
      Object.entries(filteredValues).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          value.forEach((v) => currentParams.append(key, v?.toString() || ''))
        } else {
          currentParams.set(key, value?.toString() || '')
        }
      })

      router.push(`/asset?${currentParams.toString()}`)
      setLoading(false)
      setOpen(false)
    } catch (error) {
      console.error('Error filtering:', error)
      setLoading(false)
    }
  }

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
      <Drawer open={open} closable={false} width={484} onClose={handleCancel}>
        <div className="flex items-center justify-between">
          <p className="font-weight-[600] text-[16px] font-medium">Bộ lọc</p>
          <CloseOutlined className="cursor-pointer" onClick={handleCancel} />
        </div>
        <Form form={form} layout="vertical" {...formProps}>
          <div className="flex flex-col items-center gap-[16px]">
            <AssetUserFormItem
              className="mb-[0px]! w-full"
              name="account_id"
              label="Người sử dụng"
              placeholder="Chọn người sử dụng"
            />
            <CategoryFormItems
              className="mb-[0px]! w-full"
              name="category_id"
              label="Loại tài sản"
            />
            <BrandFormItems
              className="mb-[0px]! w-full"
              name="brand_id"
              label="Nhà cung cấp"
            />

            <Form.Item
              key="status"
              className="mb-[0px]! w-full"
              name="status"
              label="Trạng thái"
            >
              <Select
                options={statusOptions}
                placeholder="Chọn trạng thái"
                allowClear
              />
            </Form.Item>
            <div className="flex w-full gap-[8px]">
              <Form.Item
                key="start_price"
                className="mb-[0px]! flex w-full flex-col"
                name="start_price"
                label="Giá mua"
              >
                <Input placeholder="Từ" name="price_from" className="w-1/2" />
              </Form.Item>
              <div className="flex items-end justify-center text-[16px]">
                <span className="h-[31px]">-</span>
              </div>
              <Form.Item
                key="end_price"
                className="mb-[0px]! w-full"
                name="end_price"
                label=" "
              >
                <Input placeholder="Đến" name="price_to" className="w-1/2" />
              </Form.Item>
            </div>
            <div className="flex w-full gap-[8px] pt-[8px]">
              <Button
                type="default"
                className="flex-1"
                onClick={() => {
                  form.resetFields()
                  router.push(`/asset`)
                }}
              >
                Reset
              </Button>
              <Button type="primary" className="flex-1" onClick={handleFilter}>
                Lọc
              </Button>
            </div>
          </div>
        </Form>
      </Drawer>
    </>
  )
}

export default AssetDrawer
