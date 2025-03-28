import { SwitchFormItem, SwitchFormItemProps } from '@/components'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Card, Checkbox, Form, Input } from 'antd'
import React from 'react'

export type EmployeeContactSwitchFormItemProps = {
  className?: string
  checked?: SwitchFormItemProps['checked']
}

const EmployeeContactSwitchFormItem: React.FC<
  EmployeeContactSwitchFormItemProps
> = ({ className, checked }) => {
  return (
    <div className={className}>
      <Form.List name="contact_list" initialValue={[{}]}>
        {(fields, { add }) => (
          <SwitchFormItem
            classNames={{
              body: 'space-y-[16px]!',
            }}
            title="Nhập thông tin gia đình, người phụ thuộc và liên hệ khác"
            extra={<Button icon={<PlusOutlined />} onClick={() => add({})} />}
            checked={checked}
          >
            {fields.map(({ key, name, ...restFields }) => (
              <Card key={key}>
                <div className="flex items-center gap-[16px]">
                  <Form.Item
                    {...restFields}
                    className="mb-[16px]! flex-1"
                    name={[name, 'name']}
                    label="Họ và tên"
                  >
                    <Input placeholder="Nhập họ và tên" />
                  </Form.Item>
                  <Form.Item
                    {...restFields}
                    className="mb-[16px]! flex-1"
                    name={[name, 'relationship']}
                    label="Mối quan hệ"
                  >
                    <Input placeholder="Nhập quan hệ" />
                  </Form.Item>
                </div>

                <Form.Item
                  {...restFields}
                  className="mb-[16px]!"
                  name={[name, 'phone_number']}
                  label="Liên hệ"
                >
                  <Input placeholder="Nhập liên hệ" />
                </Form.Item>

                <div className="flex items-center gap-[16px]">
                  <Form.Item
                    {...restFields}
                    className="mb-0! flex-1"
                    name={[name, 'is_dependent']}
                    valuePropName="checked"
                  >
                    <Checkbox>Là người phụ thuộc</Checkbox>
                  </Form.Item>
                  <Form.Item
                    {...restFields}
                    className="mb-0! flex-1"
                    name={[name, 'is_urgent']}
                    valuePropName="checked"
                  >
                    <Checkbox>Là liên hệ khẩn cấp</Checkbox>
                  </Form.Item>
                  <Form.Item
                    {...restFields}
                    className="mb-0! flex-1"
                    name={[name, 'is_household']}
                    valuePropName="checked"
                  >
                    <Checkbox>Nằm trong hộ khẩu</Checkbox>
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

export default EmployeeContactSwitchFormItem
