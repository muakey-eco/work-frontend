import {
  getAccountsAsAttendance,
  getAttendances,
  getUserById,
} from '@/libs/data'
import { getAccountProfile, getWorkSchedule } from '@/libs/schedule'
import React from 'react'
import ScheduleHolidayCalendarCard from './components/schedule-holiday-calendar-card'
import ScheduleHolidayCard from './components/schedule-holiday-card'

const SchedulePage: React.FC<any> = async ({
  params,
  searchParams,
}: {
  params: { id: string }
  searchParams: any
}) => {
  const id = params.id
  const hasSearchParams = !!searchParams && Object.keys(searchParams).length > 0

  const date = searchParams?.date ?? ''
  const day = date ? String(date).split('-').pop() : ''

  const [attendances, members, user, workSchedule] = await Promise.all([
    getAttendances({
      date,
    }),
    getAccountsAsAttendance({
      date,
    }),
    getUserById(Number(id), {
      include: 'profile',
    }),
    getWorkSchedule({
      date,
    }),
  ])

  const accountProfile = await getAccountProfile(id)

  return (
    <div className="no-scroll h-[calc(100vh-87px)] !space-y-[16px] overflow-y-auto">
      <ScheduleHolidayCard
        title="Thông tin ngày nghỉ"
        options={{
          attendances,
          members,
          day,
          user,
          workSchedule,
          accountProfile,
        }}
      />
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
        options={{
          attendances,
          members,
          day,
          user,
          workSchedule,
        }}
      />
    </div>
  )
}

export default SchedulePage
