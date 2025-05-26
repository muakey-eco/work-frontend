'use client'

import { DatePicker, Modal } from 'antd'
import dayjs from 'dayjs'
import React from 'react'

type TimeConfirmationModalProps = {
  open: boolean
  onOk: () => void
  onCancel: () => void
  value: dayjs.Dayjs | null
  currentTimeDifference: number
  onTimeChange?: (value: dayjs.Dayjs | null) => void
}

const TimeConfirmationModal: React.FC<TimeConfirmationModalProps> = ({
  open,
  onOk,
  onCancel,
  value,
  currentTimeDifference,
  onTimeChange,
}) => {
  const handleTimeChange = (value: dayjs.Dayjs | null) => {
    onTimeChange?.(value) // callback thời gian thực hiện mới
  }

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
          onChange={handleTimeChange}
          placeholder="Chọn thời gian"
          showTime
          value={value}
        />

        <p>
          Tổng thời gian thực hiện:{' '}
          <span className="text-blue-500">
            {value
              ? Math.round(value.diff(dayjs(), 'minutes')) / 60
              : Math.round(currentTimeDifference) / 60}
            h
          </span>
        </p>
      </div>
    </Modal>
  )
}

export default TimeConfirmationModal
