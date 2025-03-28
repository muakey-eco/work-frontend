'use client'

import { useAsyncEffect } from '@/libs/hook'
import { App, Form, FormInstance, Modal } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useRef, useState } from 'react'
import { addWorkflowAction, editWorkflowAction } from '../../action'
import { getAccountsRequest } from './action'
import FormFields from './FormFields'

type WorkflowModalFormProps = {
  initialValues?: any
  action?: 'create' | 'edit'
  children?: React.ReactNode
}

const WorkflowModalForm: React.FC<WorkflowModalFormProps> = ({
  initialValues,
  action = 'create',
  children,
}) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [manager, setManager] = useState<any[]>()
  const formRef = useRef<FormInstance>(null)
  const router = useRouter()

  const { message } = App.useApp()
  const {
    members: initMembers,
    departments: initDepartments,
    ...restInitialValues
  } = initialValues

  useAsyncEffect(async () => {
    if (!open) return

    const accounts = await getAccountsRequest()

    setManager([
      ...accounts?.map((acc: any) => ({
        label: acc?.full_name,
        value: acc?.username,
      })),
      ...initDepartments?.map((dep: any) => {
        const departmentValue = JSON.stringify(
          dep?.members?.map((m: any) => m?.username),
        )

        return {
          label: dep?.name,
          value: departmentValue,
        }
      }),
    ])
  }, [open])

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    const newManager = [
      ...new Set(
        formData?.manager
          ?.map((m: any) => {
            if (m?.includes('[')) {
              return JSON.parse(m)
            }
            return m
          })
          .flat(),
      ),
    ]

    try {
      if (action === 'edit') {
        var { errors } = await editWorkflowAction(initialValues?.id, {
          ...formData,
          manager: newManager.join(' '),
        })
      } else {
        var {
          message: msg,
          id: workflowId,
          errors,
        } = await addWorkflowAction({
          ...formData,
          manager: newManager.join(' '),
        })
      }

      if (errors) {
        const nameList: string[] = Object.keys(errors)

        if (msg) {
          message.error(msg)
        }

        formRef.current?.setFields(
          nameList.map((name) => ({
            name,
            errors: [errors?.[name]],
          })),
        )

        setLoading(false)
        return
      }

      if (action === 'create') router.push(`/workflows/${workflowId}`)

      message.success(
        action === 'create'
          ? 'Đã thêm 1 quy trình mới.'
          : 'Cập nhật thành công.',
      )
      setOpen(false)
      setLoading(false)

      if (typeof window !== 'undefined' && action === 'edit') {
        window.location.reload()
      }
    } catch (error: any) {
      setLoading(false)
      throw new Error(error)
    }
  }

  return (
    <>
      <div onClick={() => setOpen(true)}>{children || 'Tạo mới workflow'}</div>
      <Modal
        title={
          action === 'create'
            ? 'Tạo luồng công việc mới'
            : 'Cập nhật luồng công việc'
        }
        open={open}
        onCancel={() => setOpen(false)}
        width={760}
        okText={action === 'create' ? 'Tạo mới' : 'Cập nhật'}
        cancelText="Bỏ qua"
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        modalRender={(dom) => (
          <Form
            initialValues={{
              ...restInitialValues,
              manager: restInitialValues?.manager
                ? String(restInitialValues?.manager)?.split(' ')
                : manager?.map((m: any) => m?.value),
            }}
            ref={formRef}
            onFinish={handleSubmit}
            layout="vertical"
          >
            {dom}
          </Form>
        )}
      >
        <FormFields manager={manager} />
      </Modal>
    </>
  )
}

export default WorkflowModalForm
