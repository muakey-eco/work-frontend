'use client'

import { renameKeys } from '@/lib/utils'
import { useAsyncEffect } from '@/libs/hook'
import {
  CheckOutlined,
  CloseOutlined,
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
import React, { useEffect, useRef, useState } from 'react'
import Sortable from 'sortablejs'
import {
  createViewAction,
  getViewFieldsAction,
  getViewFieldsByIdAction,
  updateViewAction,
} from '../action'
export type ViewModalFormProps = ModalProps & {
  formProps?: FormProps
  children?: React.ReactNode
  viewId?: string
  action?: 'create' | 'update'
  onOpen?: (open: boolean) => void
  open?: boolean
}

const ViewModalForm: React.FC<ViewModalFormProps> = ({
  formProps,
  children,
  viewId,
  action,
  onOpen,
  open,
  ...rest
}) => {
  const [openAdd, setOpenAdd] = useState(false)

  const [loading, setLoading] = useState(false)
  const [viewFields, setViewFields] = useState<any[]>([])
  const [selectedFields, setSelectedFields] = useState<any[]>([])
  const [searchValue, setSearchValue] = useState('')

  const selectedFieldsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = selectedFieldsRef.current
    if (!el || selectedFields.length === 0) return

    // Hủy mọi Sortable cũ trước khi tạo mới
    if ((el as any)._sortable) {
      ;(el as any)._sortable.destroy()
    }

    const sortable = Sortable.create(el, {
      animation: 150,
      handle: '.drag-handle',
      ghostClass: 'drag-ghost',
      onEnd: (evt) => {
        const oldIndex = evt.oldIndex ?? -1
        const newIndex = evt.newIndex ?? -1
        if (oldIndex === -1 || newIndex === -1) return

        const newOrder = [...selectedFields]
        const [movedItem] = newOrder.splice(oldIndex, 1)
        newOrder.splice(newIndex, 0, movedItem)
        setSelectedFields(newOrder)
      },
    })

    // Lưu reference để có thể destroy sau
    ;(el as any)._sortable = sortable

    return () => {
      sortable.destroy()
      delete (el as any)._sortable
    }
  }, [selectedFields.length])

  //Lọc viewFields theo tên cột
  const filteredViewFields = viewFields
    .map((field) => ({
      ...field,
      children: field.children.filter((child: any) =>
        child.label.toLowerCase().includes(searchValue.toLowerCase()),
      ),
    }))
    .filter((field) => field.children.length > 0)

  //Thông báo
  const { message } = App.useApp()
  const router = useRouter()

  //Tạo views
  const handleSubmit = async (values: any) => {
    setLoading(true)

    const types = [...new Set(selectedFields.map((field) => field.type))]

    const fieldNames = Object.fromEntries(
      types.map((type) => [
        type,
        selectedFields
          .filter((field) => field.type === type)
          .map((field, index) => {
            return {
              value: field.value,
              index,
            }
          }),
      ]),
    )
    const convertFieldNames = renameKeys(fieldNames)

    try {
      const { message: msg, errors } = await (action === 'create'
        ? createViewAction({
            ...values,
            field_name: convertFieldNames,
          })
        : updateViewAction(viewId || '', {
            ...values,
            field_name: convertFieldNames,
          }))

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success(
        action === 'create'
          ? 'Tạo views thành công'
          : 'Cập nhật views thành công',
      )
      action === 'create' ? setOpenAdd(false) : onOpen?.(false)
      setLoading(false)
      setSelectedFields([])
      router.refresh()
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  //Chọn cột
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

  //Xóa cột khỏi selectedFields
  const handleDelete = (field: any) => {
    setSelectedFields((prev) => prev.filter((f) => f.value !== field.value))
  }

  useAsyncEffect(async () => {
    if (!open && !openAdd) return

    const res = await getViewFieldsAction()
    setViewFields(res)
  }, [open, openAdd])

  useEffect(() => {
    if (action === 'update' && viewId) {
      const getViewFieldsById = async () => {
        const res = await getViewFieldsByIdAction(viewId)
        setSelectedFields([...res.field_name])
        form.setFieldsValue({ name: res.name })
      }
      getViewFieldsById()
    }
  }, [viewId, action])
  const [form] = Form.useForm()

  //Chọn tất cả các cột
  const handleSelectAllInGroup = (fieldGroup: any) => {
    const groupType = fieldGroup.name
    const groupChildren = fieldGroup.children

    setSelectedFields((prev) => {
      const existingValues = new Set(prev.map((f) => f.value))
      const newFields = groupChildren
        .filter((child: any) => !existingValues.has(child.value))
        .map((child: any) => ({
          ...child,
          type: groupType,
        }))

      return [...prev, ...newFields]
    })
  }

  return (
    <>
      <div className="cursor-pointer" onClick={() => setOpenAdd(true)}>
        {children}
      </div>
      <Modal
        title={action === 'create' ? 'Tạo views mới' : 'Chỉnh sửa views'}
        open={action === 'create' ? openAdd : open}
        okText={action === 'create' ? 'Thêm' : 'Cập nhật'}
        cancelText="Hủy"
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        onCancel={() => {
          setOpenAdd(false)
          setSelectedFields([])
        }}
        destroyOnClose
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
          <Input.Search
            placeholder="Nhập tên cột"
            allowClear
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Form.Item>

        <div className="flex items-start gap-[16px]">
          <div className="flex-1 space-y-[8px]">
            <div className="text-[14px] leading-[22px]">Chọn cột</div>

            <div className="no-scroll relative h-[346px] overflow-y-auto rounded-[8px] border border-[#D9D9D9] bg-[#0000000A]">
              {filteredViewFields.map((field: any) => (
                <>
                  <div className="top-0 mb-[4px] flex h-[40px] items-center justify-between gap-[12px] pt-[4px] pl-[16px]">
                    <div className="flex items-center gap-[8px] text-[14px] leading-[22px] font-[600]">
                      <RightOutlined className="text-[12px]" />
                      <span>{field.name}</span>
                    </div>
                    <div className="border-l pr-[16px] pl-[12px]">
                      <DoubleRightOutlined
                        className="cursor-pointer"
                        onClick={() => handleSelectAllInGroup(field)}
                      />
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

            <div
              className="no-scroll h-[346px] overflow-y-auto rounded-[8px] border"
              ref={selectedFieldsRef}
            >
              {selectedFields.length > 0 ? (
                selectedFields.map((field, index) => (
                  <div
                    className="drag-item flex h-[40px] items-center justify-between gap-[8px] border-b bg-[#00000005] pl-[12px]"
                    key={field.value}
                  >
                    <div className="flex items-center gap-[8px]">
                      <MenuOutlined className="drag-handle cursor-grab active:cursor-grabbing" />
                      <span className="inline-block w-[20px] font-[600] text-[#1677FF]">
                        {index > 8 ? index + 1 : `0${index + 1}`}
                      </span>
                      <Divider className="mx-0! h-[27px]" type="vertical" />
                      <span className="font-[600]">{field.label}</span>
                    </div>
                    <CloseOutlined
                      className="cursor-pointer pr-[12px] text-[#1677FF]"
                      onClick={() => handleDelete(field)}
                    />
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
