import { getAccountsAsAttendance, getAttendances, getMe } from '@/libs/data'
import { getProposes } from '@/libs/propose'
import { getWorkSchedule } from '@/libs/schedule'
import React from 'react'
import ScheduleHolidayCalendarCard from './components/schedule-holiday-calendar-card'
import ScheduleHolidayCard from './components/schedule-holiday-card'

const SchedulePage: React.FC<any> = async (prop: { searchParams: any }) => {
  const searchParams = await prop.searchParams

  const day = String(searchParams?.date).split('-').pop()

  const hasSearchParams = Object.keys(searchParams).length > 0

  const [attendances, members, user, workSchedule, propose] = await Promise.all(
    [
      getAttendances({
        date: searchParams?.date || '',
      }),
      getAccountsAsAttendance({
        date: searchParams?.date || '',
      }),
      getMe(),
      getWorkSchedule({
        date: searchParams?.date || '',
      }),
      getProposes({
        date: searchParams?.date || '',
      }),
    ],
  )

  return (
    <div className="no-scroll h-[calc(100vh-87px)] !space-y-[16px] overflow-y-auto">
      <ScheduleHolidayCard title="Thông tin ngày nghỉ" />
      <ScheduleHolidayCalendarCard
        query={{
          type:
            hasSearchParams && !searchParams?.date
              ? searchParams?.form
                ? 'form-request'
                : 'table-history'
              : 'none',
          searchParams,
        }}
        options={{ attendances, members, day, user, workSchedule, propose }}
      />
    </div>
  )
}

export default SchedulePage
