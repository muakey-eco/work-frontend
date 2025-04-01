'use client'

import { RequestConfirmModalForm } from '@/components'
import { App, Button } from 'antd'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { deleteProposeAction } from '../../action'

type RequestDetailActionsProps = {
  hasConfirm?: boolean
  options?: any
}

const RequestDetailActions: React.FC<RequestDetailActionsProps> = ({
  hasConfirm,
  options,
}) => {
  const { requestId } = options
  const { modal, message } = App.useApp()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleDeletePropose = async (id: number) => {
    try {
      const { message: msg, errors } = await deleteProposeAction(id)

      if (errors) {
        message.error(msg)
        return
      }

      message.success('Xóa đề xuất thành công')
      router.refresh()
    } catch (error) {
      throw new Error(String(error))
    }
  }

  return (
    <div className="flex items-center gap-[12px]">
      {hasConfirm && (
        <>
          <RequestConfirmModalForm
            initialValues={{
              id: requestId,
            }}
            status="approved"
          >
            <Button
              className="hover:brightness-110"
              type="primary"
              style={{ background: '#389e0d' }}
            >
              Duyệt
            </Button>
          </RequestConfirmModalForm>
          <RequestConfirmModalForm
            initialValues={{
              id: requestId,
            }}
            status="canceled"
          >
            <Button type="primary" danger>
              Từ chối
            </Button>
          </RequestConfirmModalForm>
        </>
      )}

      <div
        onClick={() => {
          modal.confirm({
            title: 'Xác nhận xóa',
            content: 'Bạn có chắc chắn muốn xóa đề xuất này không?',
            open,
            onOk: () => handleDeletePropose(requestId),
            onCancel: () => setOpen(false),
            okText: 'Xóa',
            cancelText: 'Hủy',
          })
        }}
      >
        <Button danger variant="outlined">
          Xóa
        </Button>
      </div>
    </div>
  )
}

export default RequestDetailActions
