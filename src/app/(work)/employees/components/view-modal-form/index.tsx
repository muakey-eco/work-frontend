'use client'

import { useAsyncEffect } from '@/libs/hook'
import {
  CheckOutlined,
  DoubleRightOutlined,
  MenuOutlined,
  RightOutlined,
} from '@ant-design/icons'
import {
  App,
  Divider,
  Empty,
  Form,
  FormProps,
  Input,
  Modal,
  ModalProps,
} from 'antd'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { createViewAction, getViewFieldsAction } from '../action'
export type ViewModalFormProps = ModalProps & {
  formProps?: FormProps
  children?: React.ReactNode
}

const ViewModalForm: React.FC<ViewModalFormProps> = ({
  formProps,
  children,
  ...rest
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [viewFields, setViewFields] = useState<any[]>([])
  const [selectedFields, setSelectedFields] = useState<any[]>([])

  const { message } = App.useApp()
  const router = useRouter()

  const handleSubmit = async (values: any) => {
    setLoading(true)

    const types = [...new Set(selectedFields.map((field) => field.type))]
    const fieldNames = Object.fromEntries(
      types.map((type) => [
        type,
        selectedFields
          .filter((field) => field.type === type)
          .map((field) => field.value),
      ]),
    )

    try {
      const { message: msg, errors } = await createViewAction({
        ...values,
        field_name: fieldNames,
      })

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Tạo views thành công')
      setOpen(false)
      setLoading(false)
      setSelectedFields([])
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  const handleSelect = (child: any, type: string, isSelected: boolean) => {
    setSelectedFields((prev) => {
      const newFields = [...prev]

      if (isSelected) {
        return newFields.filter((field) => field.value !== child.value)
      }

      return [
        ...newFields,
        {
          ...child,
          type,
        },
      ]
    })
  }

  useAsyncEffect(async () => {
    if (!open) return

    const res = await getViewFieldsAction()

    setViewFields(res)
  }, [open])

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
      <Modal
        title="Tạo views mới"
        open={open}
        okText="Thêm"
        cancelText="Hủy"
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        onCancel={() => setOpen(false)}
        destroyOnClose
        modalRender={(dom) => (
          <Form onFinish={handleSubmit} layout="vertical" {...formProps}>
            {dom}
          </Form>
        )}
        width={846}
        {...rest}
      >
        <Form.Item
          name="name"
          label="Tên views"
          rules={[{ required: true, message: 'Tên views không được để trống' }]}
        >
          <Input placeholder="Nhập tên views" />
        </Form.Item>

        <Form.Item label="Cột hiển thị">
          <Input.Search placeholder="Nhận tên cột" />
        </Form.Item>

        <div className="flex items-start gap-[16px]">
          <div className="flex-1 space-y-[8px]">
            <div className="text-[14px] leading-[22px]">Chọn cột</div>

            <div className="no-scroll relative h-[346px] overflow-y-auto rounded-[8px] border border-[#D9D9D9] bg-[#0000000A]">
              {viewFields.map((field: any) => (
                <>
                  <div className="sticky top-0 mb-[4px] flex h-[40px] items-center justify-between gap-[12px] pt-[4px] pl-[16px]">
                    <div className="flex items-center gap-[8px] text-[14px] leading-[22px] font-[600]">
                      <RightOutlined className="text-[12px]" />
                      <span>{field.name}</span>
                    </div>
                    <div className="border-l pr-[16px] pl-[12px]">
                      <DoubleRightOutlined />
                    </div>
                  </div>

                  <div className="mx-[4px] divide-y rounded-[6px] border bg-[#fff]">
                    {field.children.map((child: any) => {
                      const isSelected = selectedFields.some(
                        (field) => field.value === child.value,
                      )

                      return (
                        <div
                          className={clsx(
                            'flex cursor-pointer items-center justify-between px-[12px] py-[4px] text-[14px] leading-[22px]',
                            isSelected && 'bg-[#e6f4ff]',
                          )}
                          key={child.value}
                          onClick={() =>
                            handleSelect(child, field.value, isSelected)
                          }
                        >
                          <span>{child.label}</span>
                          {isSelected && (
                            <CheckOutlined className="text-[#1677FF]" />
                          )}
                        </div>
                      )
                    })}
                  </div>
                </>
              ))}
            </div>
          </div>

          <div className="flex-1 space-y-[8px]">
            <div className="flex items-center justify-between text-[14px] leading-[22px]">
              <span>
                Các cột đã chọn{' '}
                <span className="font-[700]">({selectedFields.length})</span>
              </span>
              <span
                className="cursor-pointer text-[#0958D9]"
                onClick={() => setSelectedFields([])}
              >
                Xoá tất cả cột
              </span>
            </div>

            <div className="no-scroll h-[346px] overflow-y-auto rounded-[8px] border">
              {selectedFields.length > 0 ? (
                selectedFields.map((field, index) => (
                  <div
                    className="flex h-[40px] items-center gap-[8px] border-b bg-[#00000005] pl-[12px]"
                    key={field.value}
                  >
                    <MenuOutlined />
                    <span className="inline-block w-[20px] font-[600] text-[#1677FF]">
                      {index > 8 ? index + 1 : `0${index + 1}`}
                    </span>
                    <Divider className="mx-0! h-[27px]" type="vertical" />
                    <span className="font-[600]">{field.label}</span>
                  </div>
                ))
              ) : (
                <Empty className="pt-[60px]" description="Chưa chọn cột nào." />
              )}
            </div>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default ViewModalForm
