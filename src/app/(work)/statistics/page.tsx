import {
  getScheduleAsWorkflows,
  getWorkScheduleAsMembers,
} from '@/libs/schedule'
import { getSchedule } from '@/libs/statistics'
import { getWeek } from '@/libs/utils'
import dayjs from 'dayjs'
import React from 'react'
import PageHeader from './component/PageHeader'
import StatisticsFiltered from './component/statistics-filtered'
import StatisticsSchedule from './component/statistics-schedule'
import StatisticsModalForm from './component/statistics-schedule/statistics-modal-form'

const StatisticsPage: React.FC<any> = async (prop: { searchParams: any }) => {
  const searchParams = await prop.searchParams

  const today = new Date()
  const week = getWeek(searchParams?.dw ? new Date(searchParams?.dw) : today)
  const currentDate = String(
    dayjs(searchParams?.dw ? new Date(searchParams?.dw) : today).format(
      'YYYY-MM-DD',
    ),
  )
  const [schedule, scheduleAsMembers, scheduleAsWorkflows] = await Promise.all([
    getSchedule({
      start: week[0].date,
      end: week[6].date,
    }),
    getWorkScheduleAsMembers({
      date: currentDate,
    }),
    getScheduleAsWorkflows(),
  ])

  return (
    <div className="h-[100vh] bg-[#f6f6f6]">
      <PageHeader />
      
      {/* new */}

      <div className="p-[16px]">
        <div className="relative h-[calc(100vh-101px)] overflow-hidden rounded-[16px] border bg-[#fff]">
          <StatisticsFiltered />
          <StatisticsSchedule
            options={{
              account_id: searchParams?.mid || '',
              dw: searchParams?.dw || '',
              as: searchParams?.as || '',
              schedule,
              accounts: scheduleAsMembers,
              workflows: scheduleAsWorkflows,
              currentDate,
            }}
          />
          {/* <StatisticsScheduleComp /> */}

          <div className="absolute bottom-[16px] left-[16px]">
            <StatisticsModalForm
              options={{
                accounts: scheduleAsMembers,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatisticsPage
