'use client'

import { Input, Modal, Select } from 'antd'
import React from 'react'

type TimeConfirmationModalProps = {
  open: boolean
  onOk: () => void
  onCancel: () => void
  value: {
    amount: string
    unit: string
  }
  currentTimeDifference: number
  onTimeChange?: (value: { amount: string; unit: string }) => void
  loading?: boolean
}

const TimeConfirmationModal: React.FC<TimeConfirmationModalProps> = ({
  open,
  onOk,
  onCancel,
  value,
  currentTimeDifference,
  onTimeChange,
  loading,
}) => {
  const handleAmountChange = (amount: string) => {
    onTimeChange?.({ ...value, amount })
  }

  const handleUnitChange = (unit: string) => {
    onTimeChange?.({ ...value, unit })
  }

  return (
    <Modal
      title="Xác nhận thời gian thực hiện"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      width={411}
      cancelButtonProps={{
        style: {
          display: 'none',
        },
      }}
      okButtonProps={{
        loading,
        style: {
          display: 'none',
        },
      }}
    >
      <div className="flex flex-col gap-2 !text-[14px]">
        <p>
          Bạn đã thực hiện nhiệm vụ này trong{' '}
          <strong>{Math.round(currentTimeDifference)} phút</strong>.
        </p>
        <p>Thời gian thực tế bạn thực hiện công việc này là: </p>

        <div className="flex items-center gap-2">
          <Input
            placeholder="10, 20,..."
            value={value.amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onOk()
              }
            }}
          />
          <Select
            value={value.unit}
            options={[
              { label: 'phút', value: 'phút' },
              { label: 'giờ', value: 'giờ' },
            ]}
            onChange={handleUnitChange}
          />
        </div>
      </div>
    </Modal>
  )
}

export default TimeConfirmationModal
