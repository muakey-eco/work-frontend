'use client'

import { DatePicker, DatePickerProps, Select } from 'antd'
import { useState } from 'react'

const MarketingFilter: React.FC<any> = () => {
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
    <div className="flex items-center gap-4">
      <DatePicker picker={picker} onChange={onChange} style={{ width: 310 }} />
      <Select
        defaultValue="Ngày"
        style={{ width: 310 }}
        onChange={handleChange}
        options={[
          { value: 'date', label: 'Ngày' },
          { value: 'week', label: 'Tuần' },
          { value: 'month', label: 'Tháng' },
          { value: 'year', label: 'Năm' },
        ]}
      />
      <Select
        defaultValue="Tất cả nhân viên"
        style={{ width: 310 }}
        onChange={handleChange}
        options={[{ value: 'Tất cả nhân viên', label: 'Tất cả nhân viên' }]}
      />
    </div>
  )
}

export default MarketingFilter
