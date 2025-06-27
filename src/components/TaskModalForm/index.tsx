'use client'

import {
  App,
  DatePicker,
  Form,
  FormInstance,
  Input,
  Modal,
  ModalProps,
  Select,
} from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { Converter } from 'showdown'
import { addTagToTaskAction, addTaskAction, editTaskAction } from '../action'
import TiptapEditor from '../TiptapEditor'
import TagSelect from './TagSelect'

type TaskModalFormProps = ModalProps & {
  children?: React.ReactNode
  initialValues?: any
  query?: any
  action?: 'edit' | 'create'
}

const TaskModalForm: React.FC<TaskModalFormProps> = ({
  children,
  initialValues,
  title,
  action = 'create',
  ...rest
}) => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [tags, setTags] = useState<any[]>([])

  const [selectOpen, setSelectOpen] = useState(false)

  const { message } = App.useApp()

  const formRef = useRef<FormInstance>(null)
  const router = useRouter()

  const converter = new Converter({
    tables: true,
    strikethrough: true,
    tasklists: true,
    simpleLineBreaks: true,
  })
  const {
    account_id,
    members,
    sticker,
    description,
    userId,
    customFields,
    workflowId,
    ...restInitialValues
  } = initialValues

  const isAuth = members?.map((mem: any) => mem?.id).includes(userId)

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    const { member: memberVal, tag, ...restFormData } = formData

    const member = members.find((m: any) => {
      const fullDisplay = `${m.full_name} · ${m.username}${m.position ? ` · ${m.position}` : ''}`
      return fullDisplay === memberVal
    })

    try {
      if (!isAuth) {
        message.error('Người dùng không trong workflow này')
        return
      }

      if (action === 'create') {
        if (!workflowId) {
          message.error('Bạn phải ở trong workflow để tạo nhiệm vụ')
          return
        }

        const response = await addTaskAction({
          ...restFormData,
          description: converter.makeHtml(restFormData.description),
          account_id: member?.id || null,
          workflow_id: Number(workflowId),
          tag_id: tag || [],
        })

        if (!response) {
          message.error('Đã xảy ra lỗi khi thêm nhiệm vụ')
          return
        }

        if (response.message) {
          message.error(response.message)
          return
        }

        await addTagToTaskAction({
          task_id: response.id,
          tag_id: tag,
        })
      }

      if (action === 'edit') {
        const { errors } = await editTaskAction(initialValues?.id, {
          ...restFormData,
          description: converter.makeHtml(restFormData.description),
          account_id: member?.id || null,
          tag_id: tag || [],
          expired: restFormData?.expired
            ? dayjs(restFormData.expired).format('YYYY-MM-DD HH:mm:ss')
            : null,
        })

        if (errors) {
          if (errors.task) {
            message.error(errors.task)
          } else {
            const nameList = Object.keys(errors)
            formRef.current?.setFields(
              nameList.map((name) => ({
                name,
                errors: [errors[name]],
              })),
            )
          }
          return
        }
      }

      message.success(
        action === 'create' ? 'Thêm thành công.' : 'Cập nhật thành công.',
      )
      window.location.reload()
      setOpen(false)
    } catch (error: any) {
      message.error('Đã xảy ra lỗi không mong muốn')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const mem: any = members?.find((m: any) => m?.id === account_id)

  return (
    <>
      <div
        onClick={() => {
          if (action === 'create' && !isAuth) {
            message.error('Bạn không có quyền sửa nhiệm vụ')
            return
          }

          setOpen(true)
        }}
      >
        {children}
      </div>
      <Modal
        title={title || 'TẠO NHIỆM VỤ MỚI'}
        open={open}
        onCancel={() => setOpen(false)}
        width={760}
        cancelText="Bỏ qua"
        okText={action === 'create' ? 'Tạo nhiệm vụ mới' : 'Cập nhật'}
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            ref={formRef}
            initialValues={{
              ...restInitialValues,
              member: account_id
                ? `${`${mem?.full_name} ·`} ${mem?.username} ${!!mem?.position ? `· ${mem?.position}` : ''}`
                : undefined,
              tag: sticker?.map((s: any) => s?.sticker_id),
              expired: initialValues?.expired
                ? dayjs(initialValues?.expired)
                : null,
              description: converter.makeHtml(description || ''),
            }}
            onFinish={handleSubmit}
            layout="vertical"
            onClick={() => setSelectOpen(false)}
          >
            {dom}
          </Form>
        )}
        {...rest}
      >
        <Form.Item
          name="name"
          label="Tên nhiệm vụ"
          rules={[
            {
              required: true,
              message: 'Nhập tên nhiệm vụ.',
            },
          ]}
        >
          <Input
            className="border-b border-[#eee]"
            placeholder="Tên nhiệm vụ"
          />
        </Form.Item>
        <Form.Item name="tag" label="Thêm nhãn">
          <TagSelect
            workflowId={workflowId}
            tags={tags}
            onTagsChange={(data) => setTags(data)}
            open={selectOpen}
            onClick={() => setSelectOpen(!selectOpen)}
          />
        </Form.Item>
        <Form.Item name="fields" label="Trường tùy chỉnh">
          <Select
            options={customFields?.map((field: any) => ({
              label: field?.name,
              value: field?.id,
            }))}
          />
        </Form.Item>
        <Form.Item
          rootClassName="min-h-[240px]"
          name="description"
          label="Mô tả"
          valuePropName="content"
        >
          <TiptapEditor placeholder="Mô tả" />
        </Form.Item>
        <Form.Item name="member" label="Giao cho">
          <Select
            options={members?.map((m: any) => {
              const mem = `${`${m.full_name} ·`} ${m.username} ${!!m.position ? `· ${m.position}` : ''}`

              return {
                label: mem,
                value: mem,
              }
            })}
            placeholder="-- Lựa chọn một người dưới đây --"
          />
        </Form.Item>
        <Form.Item name="expired" label="Thời hạn">
          <DatePicker className="w-full" locale={locale} showTime />
        </Form.Item>
      </Modal>
    </>
  )
}

export default TaskModalForm
