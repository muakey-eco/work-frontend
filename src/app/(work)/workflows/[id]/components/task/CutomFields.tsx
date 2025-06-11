import { convertToSlugVer2 } from '@/lib/utils'
import { DatePicker, Form, Input, InputNumber, Select } from 'antd'
import React from 'react'

interface CutomFieldsProps {
  customFields: CutomField[]
}

const CutomFields: React.FC<CutomFieldsProps> = ({ customFields }) => {
  const renderInputByType = (field: CutomField) => {
    switch (field.type) {
      case 'text':
        return <Input placeholder={field?.description} />
      case 'number':
        return (
          <InputNumber placeholder={field?.description} className="!w-full" />
        )
      case 'date':
        return <DatePicker />
      case 'list':
        return (
          <Select
            options={field.options.map((opt: string) => ({
              label: opt,
              value: opt,
            }))}
          />
        )
      case 'paragraph':
        return <Input.TextArea placeholder={field?.description} />
      default:
        return null
    }
  }
  return (
    <>
      {customFields?.map((field: CutomField) => (
        <Form.Item
          key={field?.id}
          label={field?.name}
          name={['fields', convertToSlugVer2(field?.name)]}
          rules={[
            {
              required: field?.require === 1,
              message: 'Vui lòng nhập thông tin',
            },
          ]}
        >
          {renderInputByType(field)}
        </Form.Item>
      ))}
    </>
  )
}

interface CutomField {
  id: number
  name: string
  type: string
  workflow_id: number
  description: string
  created_at: string
  updated_at: string
  require: number
  options: string[]
}

export default CutomFields
