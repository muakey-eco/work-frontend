import { SwitchFormItem, SwitchFormItemProps } from '@/components'
import { formatCurrency } from '@/lib/utils'
import { Card, Form, InputNumber, InputNumberProps } from 'antd'
import React from 'react'

export type EmploySalarySwitchFormItemProps = Pick<
  SwitchFormItemProps,
  'checked'
> & {
  className?: string
}

const EmploySalarySwitchFormItem: React.FC<EmploySalarySwitchFormItemProps> = ({
  className,
  checked,
}) => {
  const formatProps: Pick<InputNumberProps, 'formatter' | 'parser'> = {
    formatter: formatCurrency,
    parser: (value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number,
  }

  return (
    <div className={className}>
      <SwitchFormItem title="Nhập thông tin lương (VND)" checked={checked}>
        <div className="space-y-[16px]!">
          <Card>
            <div className="mb-[16px] text-[14px] leading-[22px] font-[600]">
              Thành phần lương
            </div>

            <div className="flex items-center gap-[16px]">
              <Form.Item
                className="mb-[16px]! flex-1"
                name="basic_salary"
                label="Lương cơ bản"
              >
                <InputNumber
                  className="w-full!"
                  placeholder="Nhập"
                  {...formatProps}
                />
              </Form.Item>
              <Form.Item
                className="mb-[16px]! flex-1"
                name="travel_allowance"
                label="Phụ cấp đi lại"
              >
                <InputNumber
                  className="w-full!"
                  placeholder="Nhập"
                  {...formatProps}
                />
              </Form.Item>
            </div>

            <div className="flex items-center gap-[16px]">
              <Form.Item
                className="mb-[16px]! flex-1"
                name="food_allowance"
                label="Phụ cấp ăn uống"
              >
                <InputNumber
                  className="w-full!"
                  placeholder="Nhập"
                  {...formatProps}
                />
              </Form.Item>
              <Form.Item
                className="mb-[16px]! flex-1"
                name="kpi"
                label="Thưởng, KPI"
              >
                <InputNumber
                  className="w-full!"
                  placeholder="Nhập"
                  {...formatProps}
                />
              </Form.Item>
            </div>

            <div className="flex items-center gap-[16px]">
              <Form.Item
                className="mb-0! flex-1"
                name="insurance"
                label="BHXH, BHYT, BHTN do công ty đóng (21,5%)"
              >
                <InputNumber
                  className="w-full!"
                  placeholder="Nhập"
                  disabled
                  {...formatProps}
                />
              </Form.Item>
              <Form.Item
                className="mb-0! flex-1"
                name="insurance_employee"
                label="BHXH, BHYT, BHTN do NLĐ đóng (10,5%)"
              >
                <InputNumber
                  className="w-full!"
                  placeholder="Nhập"
                  disabled
                  {...formatProps}
                />
              </Form.Item>
            </div>
          </Card>

          <div className="flex items-center gap-[16px]">
            <Form.Item
              className="mb-0! flex-1"
              name="gross_salary"
              label="Lương Gross (Lương sau khi cộng BHXH, BHYT, BHTN)"
            >
              <InputNumber
                className="w-full!"
                placeholder="Nhập"
                disabled
                {...formatProps}
              />
            </Form.Item>
            <Form.Item
              className="mb-0! flex-1"
              name="net_salary"
              label="Lương NET"
            >
              <InputNumber
                className="w-full!"
                placeholder="Nhập"
                disabled
                {...formatProps}
              />
            </Form.Item>
          </div>
        </div>
      </SwitchFormItem>
    </div>
  )
}

export default EmploySalarySwitchFormItem
