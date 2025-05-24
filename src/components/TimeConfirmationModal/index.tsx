'use client'

import { DatePicker, Modal } from 'antd'
import dayjs from 'dayjs'
import React, { useState } from 'react'

type TimeConfirmationModalProps = {
  open: boolean
  onOk: () => void
  onCancel: () => void
  currentTimeDifference: number
  currentStartedAt: any
}

const TimeConfirmationModal: React.FC<TimeConfirmationModalProps> = ({
  open,
  onOk,
  onCancel,
  currentTimeDifference,
  currentStartedAt,
}) => {
  const [newStartedAt, setNewStartedAt] = useState<any>(null)

  return (
    <Modal
      title="Xác nhận thời gian thực hiện"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={411}
    >
      <div className="flex flex-col gap-2 !text-[14px]">
        <p>
          Bạn đã thực hiện nhiệm vụ này trong{' '}
          <strong>{Math.round(currentTimeDifference)} phút</strong>.
        </p>
        <p>Thời gian thực tế bạn bắt đầu công việc này là lúc nào?</p>

        <p>Ngày/giờ bắt đầu</p>
        <DatePicker
          onChange={(value) => {
            setNewStartedAt(value)
          }}
          placeholder="Chọn thời gian"
          showTime
        />
        <p>
          Tổng thời gian thực hiện :{' '}
          <span className="text-blue-500">
            {newStartedAt
              ? (
                  Math.round(
                    dayjs(currentStartedAt).diff(newStartedAt, 'minutes'),
                  ) / 60
                ).toFixed(2)
              : 0}
            h
          </span>
        </p>
      </div>
    </Modal>
  )
}

export default TimeConfirmationModal
