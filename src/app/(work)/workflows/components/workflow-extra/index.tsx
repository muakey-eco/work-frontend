'use client'

import { App, Form, FormInstance, Modal } from 'antd'
import React, { useRef, useState } from 'react'
import {
  addWorkflowCategoryAction,
  updateWorkflowCategoryAction,
} from '../../action'
import FormFields from './FormFields'

const WorkflowExtra: React.FC<{
  action?: 'create' | 'edit'
  initialValues?: any
  children?: React.ReactNode
}> = ({ action = 'create', initialValues, children }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)

  const formRef = useRef<FormInstance>(null)
  const { message } = App.useApp()
  const { cate, id, departments } = initialValues

  const handleSubmit = async (formData: any) => {
    setLoading(true)

    try {
      if (action === 'edit') {
        var { errors } = await updateWorkflowCategoryAction(id || cate?.id, {
          ...formData,
        })
      } else {
        var { errors } = await addWorkflowCategoryAction({
          ...formData,
        })
      }

      if (errors) {
        const nameList = Object.keys(errors)

        formRef.current?.setFields(
          nameList.map((name: string) => ({
            name,
            errors: [errors?.[name]],
          })),
        )

        setLoading(false)
        return
      }

      message.success(
        action === 'create' ? 'Đã thêm 1 danh mục mới' : 'Cập nhật thành công',
      )
      setOpen(false)
      setLoading(false)

      if (typeof window !== undefined) {
        window.location.reload()
      }
    } catch (error: any) {
      setLoading(false)
      throw new Error(error)
    }
  }

  const isAuth =
    String(initialValues?.user?.role).toLowerCase().includes('quản trị') ||
    initialValues?.members
      ?.map((mem: any) => mem?.id)
      .includes(initialValues?.user?.id)

  return (
    <>
      <div
        onClick={() => {
          if (action === 'edit') {
            if (!isAuth) {
              message.error('Bạn không có quyền sửa danh mục')
              return
            }
          }

          setOpen(true)
        }}
      >
        {children}
      </div>
      <Modal
        title={action === 'create' ? 'TẠO DANH MỤC MỚI' : 'CẬP NHẬT DANH MỤC'}
        open={open}
        onCancel={() => setOpen(false)}
        width={1000}
        okText={action === 'create' ? 'Tạo danh mục mới' : 'Cập nhật'}
        cancelText="Bỏ qua"
        okButtonProps={{
          htmlType: 'submit',
          loading,
        }}
        destroyOnClose
        modalRender={(dom) => (
          <Form
            onFinish={handleSubmit}
            ref={formRef}
            layout="vertical"
            initialValues={{
              name: cate?.name,
            }}
          >
            {dom}
          </Form>
        )}
      >
        <FormFields options={{ departments }} />
      </Modal>
    </>
  )
}

export default WorkflowExtra
