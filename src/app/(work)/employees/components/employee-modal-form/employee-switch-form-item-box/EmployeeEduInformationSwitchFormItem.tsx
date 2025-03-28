import { SwitchFormItem, SwitchFormItemProps } from '@/components'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, DatePicker, Form, Input } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import React from 'react'

export type EmployeeEduInformationSwitchFormItemProps = {
  className?: string
  checked?: SwitchFormItemProps['checked']
}

const EmployeeEduInformationSwitchFormItem: React.FC<
  EmployeeEduInformationSwitchFormItemProps
> = ({ className, checked }) => {
  return (
    <div className={className}>
      <Form.List name="education_list" initialValue={[{}]}>
        {(fields, { add }) => (
          <SwitchFormItem
            classNames={{
              body: 'space-y-[16px]!',
            }}
            title="Nhập thông tin học vấn"
            checked={checked}
            extra={<Button icon={<PlusOutlined />} onClick={() => add({})} />}
          >
            {fields?.map(({ key, name, ...restFields }) => (
              <Card key={key}>
                <div className="flex items-center gap-[16px]">
                  <Form.Item
                    {...restFields}
                    className="mb-[16px]! flex-1"
                    name={[name, 'school_name']}
                    label="Tên trường"
                  >
                    <Input placeholder="Nhập tên trường" />
                  </Form.Item>
                  <Form.Item
                    {...restFields}
                    className="mb-[16px]! flex-1"
                    name={[name, 'major']}
                    label="Chuyên ngành"
                  >
                    <Input placeholder="Nhập chuyên ngành" />
                  </Form.Item>
                </div>

                <div className="flex items-center gap-[16px]">
                  <Form.Item
                    {...restFields}
                    className="mb-0! flex-1"
                    name={[name, 'time_range']}
                    label="Thời gian (Bắt đầu - kết thúc)"
                  >
                    <DatePicker.RangePicker
                      className="w-full"
                      locale={locale}
                    />
                  </Form.Item>
                  <Form.Item
                    {...restFields}
                    className="mb-0! flex-1"
                    name={[name, 'degree']}
                    label="Bằng cấp"
                  >
                    <Input placeholder="Nhập" />
                  </Form.Item>
                </div>
              </Card>
            ))}
          </SwitchFormItem>
        )}
      </Form.List>
    </div>
  )
}

export default EmployeeEduInformationSwitchFormItem
