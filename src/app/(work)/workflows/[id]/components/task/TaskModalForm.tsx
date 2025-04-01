'use client'

import { TiptapEditor } from '@/components'
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
import { useParams } from 'next/navigation'
import React, { useContext, useRef, useState } from 'react'
import { addTaskAction, editTaskAction } from '../../../action'
import { StageContext } from '../WorkflowPageLayout'
import { addTagToTaskAction } from './action'
import TagSelect from './tag-select'

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

  const params = useParams()
  const { setStages, isAuth } = useContext(StageContext)
  const { message } = App.useApp()
  const formRef = useRef<FormInstance>(null)

  const { account_id, members, ...restInitialValues } = initialValues

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
          description: restFormData.description,
          account_id: member?.id || null,
          workflow_id: params?.id || null,
          tag_id: tag || [],
        })

        if (!errors) {
          await addTagToTaskAction({
            task_id: id,
            tag_id: tag,
          })

          setStages((prevStages: any[]) => {
            const newStages = [...prevStages]

            return newStages?.map((stage: any) => {
              if (
                !restInitialValues?.stage_id &&
                stage?.id === newStages[0]?.id
              ) {
                return {
                  ...stage,
                  tasks: [
                    {
                      ...restFormData,
                      description: restFormData.description,
                      account_id: member?.id || null,
                      workflow_id: params?.id || null,
                      stage_id: Number(String(stage?.id).split('_').pop()),
                      id,
                      sticker: tag?.map((t: number) => {
                        const tagName = tags.find(
                          (s: any) => s?.id === t,
                        )?.title
                        return {
                          name: tagName,
                          sticker_id: t,
                        }
                      }),
                    },
                    ...stage?.tasks,
                  ],
                }
              }

              return stage
            })
          })
        }
      } else {
        if (!isAuth) {
          message.error('Bạn không có quyền sửa nhiệm vụ')
          return
        }

        var { errors } = await editTaskAction(initialValues?.id, {
          ...restFormData,
          description: restFormData.description,
          account_id: member?.id || null,
          tag_id: tag || [],
          expired: restFormData?.expired
            ? String(dayjs(restFormData?.expired).format('YYYY-MM-DD HH:mm:ss'))
            : null,
        })

        if (!errors) {
          setStages((prevStages: any[]) => {
            const newStages = [...prevStages]

            return newStages?.map((stage: any) => {
              if (stage?.id === `stage_${initialValues?.stage_id}`) {
                return {
                  ...stage,
                  tasks: stage?.tasks?.map((task: any) => {
                    if (task?.id === initialValues?.id) {
                      return {
                        ...restFormData,
                        description: restFormData.description,
                        account_id: member?.id || null,
                        stage_id: stage?.id,
                        id: initialValues?.id,
                        sticker: tag?.map((t: number) => {
                          const tagName = tags.find(
                            (s: any) => s?.id === t,
                          )?.title

                          return {
                            name: tagName,
                            sticker_id: t,
                          }
                        }),
                      }
                    }

                    return task
                  }),
                }
              }

              return stage
            })
          })
        }
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
        setLoading(false)
        return
      }

      message.success(
        action === 'create' ? 'Thêm thành công.' : 'Cập nhật thành công.',
      )
      setOpen(false)
      setLoading(false)
    } catch (error: any) {
      setLoading(false)
      throw new Error(error)
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
        classNames={{
          mask: 'z-auto!',
          wrapper: 'z-auto!',
        }}
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
              tag: initialValues?.tags?.map((s: any) => s?.id),
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
            params={params}
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
          valuePropName="content"
        >
          <TiptapEditor placeholder="Mô tả nhiệm vụ" />
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
