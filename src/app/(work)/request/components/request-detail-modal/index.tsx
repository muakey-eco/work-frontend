'use client'

import { randomColor } from '@/libs/utils'
import { Avatar, Divider, Modal, ModalProps, Tag } from 'antd'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import RequestDetailActions from './request-detail-actions'
import RequestDetailChanges from './request-detail-changes'
import RequestDetailLine from './request-detail-line'

type RequestDetailModalProps = ModalProps & {
  children?: React.ReactNode
  request?: any
  userRole?: string
}

const generateStatus = (status: string) => {
  switch (status) {
    case 'pending':
      return <Tag color="blue">Đang chờ duyệt</Tag>

    case 'approved':
      return <Tag color="green">Đã duyệt</Tag>

    case 'canceled':
      return <Tag color="red">Từ chối</Tag>

    default:
      return <></>
  }
}

const RequestDetailModal: React.FC<RequestDetailModalProps> = ({
  children,
  request,
  userRole,
}) => {
  const [open, setOpen] = useState(true)

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        title="CHI TIẾT ĐỀ XUẤT"
        footer={null}
        width={1000}
      >
        <div className="my-[24px] flex flex-col gap-[24px]">
          <div className="flex items-center">
            <RequestDetailLine
              className="flex-1"
              label="Người tạo"
              labelWidth={100}
            >
              <div className="flex items-center gap-[12px]">
                <Avatar
                  src={request?.account?.avatar}
                  style={{
                    backgroundColor: randomColor(
                      String(request.account?.full_name),
                    ),
                  }}
                >
                  {String(request.account?.full_name).charAt(0).toUpperCase()}
                </Avatar>
                <span>{request.account?.full_name}</span>
              </div>
            </RequestDetailLine>
            <RequestDetailLine
              className="flex-1"
              label="Ngày tạo"
              labelWidth={100}
            >
              {dayjs(request.created_at).format('DD/MM/YYYY')}
            </RequestDetailLine>
          </div>

          <div className="flex items-center">
            <RequestDetailLine
              className="flex-1"
              label="Tên đề xuất"
              labelWidth={100}
            >
              {request.name}
            </RequestDetailLine>
            <RequestDetailLine
              className="flex-1"
              label="Trạng thái"
              labelWidth={100}
            >
              {generateStatus(request?.status)}
            </RequestDetailLine>
          </div>

          <Divider className="my-0!" />

          <RequestDetailChanges
            type={request?.category_name}
            request={request}
          />

          <Divider className="my-0!" />

          <RequestDetailActions
            hasConfirm={userRole === 'Quản trị cấp cao'}
            options={{ requestId: request.id }}
          />
        </div>
      </Modal>
    </>
  )
}

export default RequestDetailModal
