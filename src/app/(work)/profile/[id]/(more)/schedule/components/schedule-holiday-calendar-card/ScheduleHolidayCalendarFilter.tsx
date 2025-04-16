import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { Button, DatePicker } from 'antd'
import locale from 'antd/es/date-picker/locale/vi_VN'
import React from 'react'

export type ScheduleHolidayCalendarFilterProps = {}

const ScheduleHolidayCalendarFilter: React.FC<
  ScheduleHolidayCalendarFilterProps
> = () => {
  return (
    <div className="flex items-center gap-[8px]">
      <DatePicker className="w-[189px]" locale={locale} />
      <Button icon={<LeftOutlined />} />
      <Button>Hôm nay</Button>
      <Button icon={<RightOutlined />} />
    </div>
  )
}

export default ScheduleHolidayCalendarFilter
