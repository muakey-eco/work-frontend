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
  const [openModal, setOpenModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [manager, setManager] = useState<any[]>()
  const formRef = useRef<FormInstance>(null)
  const router = useRouter()

  const { message } = App.useApp()
  const {
    members: initMembers,
    departments: initDepartments,
    workflow_category_id: initWorkflowCategoryId,
    ...restInitialValues
  } = initialValues

  useAsyncEffect(async () => {
    if (!openModal) return

    const accounts = await getAccountsRequest()

    setManager([
      ...accounts?.map((acc: any) => ({
        label: acc?.full_name,
        value: acc?.id,
      })),
      ...initDepartments?.map((dep: any) => {
        const departmentValue = JSON.stringify(
          dep?.members?.map((m: any) => m?.id),
        )

        return {
          label: dep?.name,
          value: departmentValue,
        }
      }),
    ])
  }, [openModal])

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    const newManager = [
      ...new Set(
        formData?.manager
          ?.map((m: any) => {
            if (typeof m === 'string' && m.includes('[')) {
              try {
                return JSON.parse(m)
              } catch (e) {
                return m
              }
            }
            return m
          })
          .flat()
          .map(Number),
      ),
    ]

    try {
      if (action === 'edit') {
        var { errors } = await editWorkflowAction(initialValues?.id, {
          ...formData,
          manager: newManager,
        })
      } else {
        var {
          message: msg,
          id: workflowId,
          errors,
        } = await addWorkflowAction({
          ...formData,
          workflow_category_id: initWorkflowCategoryId,
          manager: newManager,
        })
        const id = workflowId ? workflowId : initWorkflowCategoryId

        if (action === 'create') router.push(`/workflows/${id}`)
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

      message.success(
        action === 'create'
          ? 'Đã thêm 1 quy trình mới.'
          : 'Cập nhật thành công.',
      )
      setOpenModal(false)
      setLoading(false)

      if (typeof window !== 'undefined' && action === 'edit') {
        window.location.reload()
      }
    } catch (error: any) {
      setLoading(false)
      message.error(error?.message)
    }
  }

  return (
    <>
      <div onClick={() => setOpenModal(true)}>
        {children || 'Tạo mới workflow'}
      </div>
      <Modal
        title={
          action === 'create'
            ? 'Tạo luồng công việc mới'
            : 'Cập nhật luồng công việc'
        }
        open={openModal}
        onCancel={() => setOpenModal(false)}
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
                ? String(restInitialValues?.manager)
                    ?.split(' ')
                    .map((m: any) => {
                      if (typeof m === 'string' && !isNaN(Number(m))) {
                        return Number(m)
                      }
                      return m
                    })
                : [],
            }}
            ref={formRef}
            onFinish={handleSubmit}
            layout="vertical"
          >
            {dom}
          </Form>
        )}
      >
        <div onClick={(e) => e.stopPropagation()}>
          <FormFields manager={manager} />
        </div>
      </Modal>
    </>
  )
}

export default WorkflowModalForm
