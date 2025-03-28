import { SwitchFormItem, SwitchFormItemProps } from '@/components'
import { Card, Form, Input, Radio, RadioGroupProps, Select } from 'antd'
import React from 'react'

export type EmployeeLegalInformationSwitchFormItemProps = {
  className?: string
  checked?: SwitchFormItemProps['checked']
}

const EmployeeLegalInformationSwitchFormItem: React.FC<
  EmployeeLegalInformationSwitchFormItemProps
> = ({ className, checked }) => {
  const options: RadioGroupProps['options'] = [
    { label: 'Có', value: '1' },
    { label: 'Không', value: '0' },
  ]

  const salaryZoneOptions = [
    { label: 'Vùng I', value: '1' },
    { label: 'Vùng II', value: '2' },
    { label: 'Vùng III', value: '3' },
    { label: 'Vùng IV', value: '4' },
  ]

  return (
    <div className={className}>
      <SwitchFormItem title="Nhập thông tin pháp lý" checked={checked}>
        <Card>
          <div className="flex items-center gap-[16px]">
            <Form.Item
              className="mb-[16px]! flex-1"
              name="tax_code"
              label="Mã số thuế"
            >
              <Input placeholder="Nhập" />
            </Form.Item>
            <Form.Item
              className="mb-[16px]! flex-1"
              name="tax_reduced"
              label="Giảm trừ thuế thu nhập cá nhân"
              initialValue={true}
            >
              <Radio.Group options={options} />
            </Form.Item>
          </div>

          <Form.Item className="mb-[16px]!" name="BHXH" label="Số sổ BHXH">
            <Input placeholder="Nhập" />
          </Form.Item>

          <div className="flex items-center gap-[16px]">
            <Form.Item
              className="mb-0! flex-1"
              name="place_of_registration"
              label="Nơi đăng ký"
            >
              <Input placeholder="Nhập" />
            </Form.Item>
            <Form.Item
              className="mb-0! flex-1"
              name="salary_scale"
              label="Vùng lương"
            >
              <Select placeholder="Chọn" options={salaryZoneOptions} />
            </Form.Item>
          </div>
        </Card>
      </SwitchFormItem>
    </div>
  )
}

export default EmployeeLegalInformationSwitchFormItem
