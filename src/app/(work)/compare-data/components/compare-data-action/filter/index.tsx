'use client'

import { PlusOutlined } from '@ant-design/icons'
import { Button, DatePicker, DatePickerProps, Select } from 'antd'
import { useState } from 'react'

const CompareDataFilter = () => {
  const [picker, setPicker] = useState<'date' | 'week' | 'month' | 'year'>(
    'date',
  )
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
  }
  const handleChange = (value: string) => {
    setPicker(value as 'date' | 'week' | 'month' | 'year')
  }
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex gap-4">
        <DatePicker
          picker={picker}
          onChange={onChange}
          style={{ width: 310 }}
        />
        <Select
          defaultValue="date"
          style={{ width: 310 }}
          onChange={handleChange}
          options={[
            { value: 'date', label: 'Ngày' },
            { value: 'week', label: 'Tuần' },
            { value: 'month', label: 'Tháng' },
            { value: 'year', label: 'Năm' },
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
