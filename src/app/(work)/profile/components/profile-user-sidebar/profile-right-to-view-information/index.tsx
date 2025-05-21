'use client'

import { CheckOutlined, EyeOutlined } from '@ant-design/icons'
import { Checkbox, Form, Modal, Select, SelectProps } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'

const rightToViewInformationOptions: SelectProps['options'] = [
  {
    label: 'Công khai (Công khai thông tin liên hệ của tất cả nhân viên)',
    value: 'public',
  },
  {
    label:
      'Riêng tư (Chỉ hiển thị thông tin cho người quản lý, Admin và cấp cao hơn)',
    value: 'private',
  },
]

type ProfileRightToViewInformationModalFormProps = {
  active?: boolean
  label?: string
  onChangeValue?: (text: string) => void
}

const ProfileRightToViewInformationModalForm: React.FC<
  ProfileRightToViewInformationModalFormProps
> = ({ active, onChangeValue, label }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectItemDropDown, setSelectItemDropDown] = useState('public')

  const handelCancel = () => {
    setIsModalOpen(false)
    onChangeValue && onChangeValue('')
  }

  return (
    <>
      <div
        className={clsx('flex cursor-pointer gap-[10px] hover:text-[#1890FF]', {
          'text-[#1890FF]': active,
        })}
        onClick={() => {
          setIsModalOpen(true)
          onChangeValue && onChangeValue(label || '')
        }}
      >
        <EyeOutlined />
        {label}
      </div>
      <Modal
        okText="Lưu"
        cancelText="Hủy"
        title="Quyền xem thông tin"
        open={isModalOpen}
        onOk={handelCancel}
        onCancel={handelCancel}
        width={634}
      >
        <Form layout="vertical" className="flex w-full flex-col gap-[16px]">
          <div>
            <Form.Item className="mb-0!" label="Quyền xem thông tin">
              <Select
                defaultValue="Công khai (Công khai thông tin liên hệ của tất cả nhân viên)"
                options={rightToViewInformationOptions}
                optionRender={(option) => (
                  <div
                    className="flex items-center"
                    onClick={() => {
                      setSelectItemDropDown(option.value?.toString() || '')
                    }}
                  >
                    {option.value === selectItemDropDown && (
                      <CheckOutlined
                        style={{ color: 'green', marginRight: 8 }}
                      />
                    )}
                    {option.label}
                  </div>
                )}
              />
            </Form.Item>
          </div>

          <div>
            Thông tin cần ẩn (Chỉ có tác dụng khi lựa chọn chế độ Riêng tư)
          </div>

          <div className="grid grid-cols-2">
            <Form.Item className="mb-0! flex-1">
              <Checkbox>Thông tin cá nhân</Checkbox>
            </Form.Item>
            <Form.Item className="mb-0! flex-1">
              <Checkbox>Thông tin nhân viên</Checkbox>
            </Form.Item>
            <Form.Item className="mb-0! flex-1">
              <Checkbox>Trình độ học vấn</Checkbox>
            </Form.Item>
            <Form.Item className="mb-0! flex-1">
              <Checkbox>Kinh nghiệm làm việc</Checkbox>
            </Form.Item>
            <Form.Item className="mb-0! flex-1">
              <Checkbox>Giải thưởng & Thành tích</Checkbox>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </>
  )
}

export default ProfileRightToViewInformationModalForm
