'use client'

import { CheckCircleFilled } from '@ant-design/icons'
import { Modal } from 'antd'
import React, { useState } from 'react'

const CheckoutButton: React.FC<{
  onCheckedOut?: () => void
}> = ({ onCheckedOut }) => {
  const [confirm, setConfirm] = useState(false)
  return (
    <>
      <CheckCircleFilled
        className="text-[14px] !text-[#2bbf3d]"
        onClick={(e) => {
          e.preventDefault()
          setConfirm(true)
        }}
      />
      <Modal
        open={confirm}
        onOk={onCheckedOut}
        onCancel={() => setConfirm(false)}
      >
        <div>Xác nhận Check out?</div>
      </Modal>
    </>
  )
}

export default CheckoutButton
