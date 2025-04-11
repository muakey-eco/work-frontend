'use client'

import { DatePicker, DatePickerProps, Select } from 'antd'

const MarketingFilter: React.FC<any> = () => {
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
  }
  const handleChange = (value: string) => {
    console.log(`selected ${value}`)
  }
  return (
    <div className="flex items-center gap-4">
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
