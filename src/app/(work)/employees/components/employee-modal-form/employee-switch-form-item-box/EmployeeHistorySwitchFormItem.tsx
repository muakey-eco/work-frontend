import { SwitchFormItem, SwitchFormItemProps } from '@/components'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Form, Input } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import React from 'react'

export type EmployeeHistorySwitchFormItemProps = {
  className?: string
  checked?: SwitchFormItemProps['checked']
}

const EmployeeHistorySwitchFormItem: React.FC<
  EmployeeHistorySwitchFormItemProps
> = ({ className, checked }) => {
  return (
    <div className={className}>
      <Form.List name="history_list" initialValue={[{}]}>
        {(fields, { add }) => (
          <SwitchFormItem
            classNames={{
              body: 'space-y-[16px]!',
            }}
            title="Nhập thông tin lịch sử làm việc"
            extra={<Button icon={<PlusOutlined />} onClick={() => add({})} />}
            checked={checked}
          >
            {fields?.map(({ key, name, ...restFields }) => (
              <Card key={key}>
                <div className="flex items-center gap-[16px]">
                  <Form.Item
                    {...restFields}
                    className="mb-[16px]! flex-1"
                    name={[name, 'company_name']}
                    label="Tổ chức, doanh nghiệp"
                  >
                    <Input placeholder="Nhập tên tổ chức, doanh nghiệp" />
                  </Form.Item>
                  <Form.Item
                    {...restFields}
                    className="mb-[16px]! flex-1"
                    name={[name, 'time_range']}
                    label="Thời gian (Bắt đầu - kết thúc)"
                  >
                    <DatePicker.RangePicker
                      className="w-full"
                      locale={locale}
                    />
                  </Form.Item>
                </div>

                <Form.Item
                  {...restFields}
                  className="mb-[16px]! flex-1"
                  name={[name, 'position']}
                  label="Vị tri"
                >
                  <Input placeholder="Nhập vị trí" />
                </Form.Item>
              </Card>
            ))}
          </SwitchFormItem>
        )}
      </Form.List>
    </div>
  )
}

export default EmployeeHistorySwitchFormItem
