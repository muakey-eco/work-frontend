import { formatCurrency } from '@/lib/utils'
import { Card, Form, InputNumber, InputNumberProps } from 'antd'
import React from 'react'

export type JobProgressNewInfomationFormCardProps = {
  title?: string
}

const JobProgressNewInfomationFormCard: React.FC<
  JobProgressNewInfomationFormCardProps
> = ({ title }) => {
  const formatProps: Pick<InputNumberProps, 'formatter' | 'parser'> = {
    formatter: formatCurrency,
    parser: (value) => value?.replace(/\$\s?|(,*)/g, '') as unknown as number,
  }

  return (
    <Card>
      <div className="mb-[16px] text-[14px] leading-[22px] font-[600]">
        {title}
      </div>

      <div className="flex items-center gap-[16px]">
        <Form.Item
          className="mb-[16px]! flex-1"
          label="Lương cơ bản"
          name="basic_salary"
        >
          <InputNumber
            className="w-full!"
            placeholder="Nhập"
            {...formatProps}
          />
        </Form.Item>

        <Form.Item
          className="mb-[16px]! flex-1"
          label="Phụ cấp đi lại"
          name="travel_allowance"
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
          label="Phụ cấp ăn uống"
          name="eat_allowance"
        >
          <InputNumber
            className="w-full!"
            placeholder="Nhập"
            {...formatProps}
          />
        </Form.Item>

        <Form.Item className="mb-[16px]! flex-1" label="Thưởng, KPI" name="kpi">
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
          label="BHXH, BHYT, BHTN do công ty đóng (21,5%)"
          name="insurance"
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
          label="BHXH, BHYT, BHTN do NLĐ đóng (10,5%)"
          name="insurance_employee"
        >
          <InputNumber
            className="w-full!"
            placeholder="Nhập"
            disabled
            {...formatProps}
          />
        </Form.Item>
      </div>

      <div className="mt-[16px] flex items-center gap-[16px]">
        <Form.Item
          className="mb-0! flex-1"
          label="Lương Gross (Lương sau khi cộng BHXH, BHYT, BHTN)"
          name="gross_salary"
        >
          <InputNumber
            className="w-full!"
            placeholder="Nhập"
            disabled
            {...formatProps}
          />
        </Form.Item>

        <Form.Item className="mb-0! flex-1" label="Lương Net" name="net_salary">
          <InputNumber
            className="w-full!"
            placeholder="Nhập"
            disabled
            {...formatProps}
          />
        </Form.Item>
      </div>
    </Card>
  )
}

export default JobProgressNewInfomationFormCard
