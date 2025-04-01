'use client'

import { InitializedMDXEditor } from '@/components'
import { useAsyncEffect } from '@/libs/hook'
import { MDXEditorMethods } from '@mdxeditor/editor'
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
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { Converter } from 'showdown'
import { addTagToTaskAction, addTaskAction, editTaskAction } from '../action'
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

  const searchParams = useSearchParams()
  const { message } = App.useApp()
  const editorRef = useRef<MDXEditorMethods>(null)
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
    ...restInitialValues
  } = initialValues

  const isAuth = members?.map((mem: any) => mem?.id).includes(userId)

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    const { member: memberVal, tag, ...restFormData } = formData

    const member: any = members.find(
      (m: any) =>
        `${`${m.full_name} ·`} ${m.username} ${!!m.position ? `· ${m.position}` : ''}` ===
        memberVal,
    )

    try {
      if (action === 'create') {
        var { errors, id } = await addTaskAction({
          ...restFormData,
          description: converter.makeHtml(restFormData.description),
          account_id: member?.id || null,
          workflow_id: Number(searchParams.get('wid')),
          tag_id: tag || [],
        })

        if (!errors) {
          await addTagToTaskAction({
            task_id: id,
            tag_id: tag,
          })
        }
      } else {
        if (!isAuth) {
          message.error('Bạn không có quyền sửa nhiệm vụ')
          return
        }

        var { errors } = await editTaskAction(initialValues?.id, {
          ...restFormData,
          description: converter.makeHtml(restFormData.description),
          account_id: member?.id || null,
          tag_id: tag || [],
          expired: restFormData?.expired
            ? String(dayjs(restFormData?.expired).format('YYYY-MM-DD HH:mm:ss'))
            : null,
        })
      }

      if (errors) {
        if (errors.task) {
          message.error(errors.task)
          setLoading(false)
          return
        }

        const nameList: string[] = Object.keys(errors)

        formRef.current?.setFields(
          nameList.map((name) => ({
            name,
            errors: [errors?.[name]],
          })),
        )

        return
      }

      message.success(
        action === 'create' ? 'Thêm thành công.' : 'Cập nhật thành công.',
      )
      setOpen(false)
      setLoading(false)
      router.refresh()
    } catch (error: any) {
      setLoading(false)
      throw new Error(error)
    }
  }

  const mem: any = members?.find((m: any) => m?.id === account_id)

  useAsyncEffect(async () => {
    if (!open) return

    editorRef.current?.setMarkdown(description || '')
  }, [open])

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
            params={{
              id: Number(searchParams.get('wid')),
            }}
            tags={tags}
            onTagsChange={(data) => setTags(data)}
            open={selectOpen}
            onClick={() => setSelectOpen(!selectOpen)}
          />
        </Form.Item>
        <Form.Item
          rootClassName="min-h-[240px]"
          name="description"
          label="Mô tả"
        >
          <InitializedMDXEditor
            contentEditableClassName="p-[12px] border border-[#eee] focus:outline-hidden rounded-[4px] min-h-[180px] prose max-w-full!"
            ref={editorRef}
            markdown={converter.makeMarkdown(description || '')}
            placeholder="Mô tả nhiệm vụ"
          />
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
