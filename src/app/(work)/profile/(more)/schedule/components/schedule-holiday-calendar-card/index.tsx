'use client'

import { Card, CardProps } from 'antd'
import React, { useState } from 'react'
import ScheduleHolidayCalendar from './ScheduleHolidayCalendar'
import ScheduleHolidayCalendarFilter from './ScheduleHolidayCalendarFilter'
import ScheduleHolidayCalendarGuide from './ScheduleHolidayCalendarGuide'

export type ScheduleHolidayCalendarCardProps = CardProps & {
  query?: any
  options?: any
}

const ScheduleHolidayCalendarCard: React.FC<
  ScheduleHolidayCalendarCardProps
> = ({ options, query, ...props }) => {
  const { members, day, ...restOptions } = options

  const [date, setDate] = useState<any>(new Date())

  return (
    <Card
      classNames={{
        body: '!space-y-[16px] !p-0',
      }}
      {...props}
    >
      <div className="!mb-0 flex items-center justify-between gap-[24px] px-[24px] py-[16px]">
        <ScheduleHolidayCalendarFilter />
        <ScheduleHolidayCalendarGuide />
      </div>

      <ScheduleHolidayCalendar
        options={{
          ...restOptions,
          members: members?.filter((mem: any) => mem?.type !== 'department'),
          day: Number(day || 0),
        }}
        onDateSelect={setDate}
      />
    </Card>
  )
}

export default ScheduleHolidayCalendarCard
