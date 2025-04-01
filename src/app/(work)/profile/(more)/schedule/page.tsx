import { getAttendances } from '@/libs/data'
import dayjs from 'dayjs'
import React from 'react'
import ScheduleHolidayCalendarCard from './components/schedule-holiday-calendar-card'
import ScheduleHolidayCard from './components/schedule-holiday-card'

const SchedulePage: React.FC<any> = async (prop: { searchParams: any }) => {
  const searchParams = await prop.searchParams

  const todayStr = String(dayjs(new Date()).format('YYYY-MM'))

  const data = await getAttendances({
    date: searchParams?.date || todayStr,
    account_id: 3,
  })

  return (
    <div className="no-scroll h-[calc(100vh-87px)] !space-y-[16px] overflow-y-auto">
      <ScheduleHolidayCard title="Thông tin ngày nghỉ" />
      <ScheduleHolidayCalendarCard data={data} />
    </div>
  )
}

export default SchedulePage
