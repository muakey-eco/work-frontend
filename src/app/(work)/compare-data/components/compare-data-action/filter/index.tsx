'use client'

import { PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, DatePickerProps, Select } from 'antd'

const CompareDataFilter = () => {
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
  }
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex gap-4">
        <DatePicker onChange={onChange} style={{ width: 310 }} />
        <Select
          defaultValue="Ngày"
          style={{ width: 310 }}
          onChange={handleChange}
          options={[
            { value: 'Ngày', label: 'Ngày' },
            { value: 'Tháng', label: 'Tháng' },
            { value: 'Năm', label: 'Năm' },
          ]}
        />
      </div>
      <Button type="primary" icon={<PlusOutlined />}>
        Thêm
      </Button>
    </div>
  )
}

export default CompareDataFilter
