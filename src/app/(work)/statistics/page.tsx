import { getMyAccount, getWorkflowCategories } from '@/libs/data'
import { getDepartments } from '@/libs/department'
import {
  getScheduleAsWorkflows,
  getWorkScheduleAsMembers,
} from '@/libs/schedule'
import { getSchedule } from '@/libs/statistics'
import { getWeek } from '@/libs/utils'
import dayjs from 'dayjs'
import React from 'react'
import OverviewHeader from '../department/[department_id]/overview/overview-header'
import StatisticsFiltered from './component/statistics-filtered'
import StatisticsSchedule from './component/statistics-schedule'
import StatisticsModalForm from './component/statistics-schedule/statistics-modal-form'

type StatisticsPageProps = {
  searchParams: { [key: string]: string | string[] | undefined }
}

const StatisticsPage: React.FC<StatisticsPageProps> = async ({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) => {
  const today = new Date()

  const week = getWeek(
    searchParams?.dw ? new Date(searchParams?.dw as string) : today,
  )
  const currentDate = String(
    dayjs(
      searchParams?.dw ? new Date(searchParams?.dw as string) : today,
    ).format('YYYY-MM-DD'),
  )

  const [
    schedule,
    scheduleAsMembers,
    scheduleAsWorkflows,
    departments,
    myAccount,
    workflowCategories,
  ] = await Promise.all([
    getSchedule({
      start: week[0].date,
      end: week[6].date,
    }),
    getWorkScheduleAsMembers({
      date: currentDate,
    }),
    getScheduleAsWorkflows(),
    getDepartments(),
    getMyAccount(),
    getWorkflowCategories(),
  ])
  return (
    <div className="h-[100vh] bg-[#f6f6f6]">
      <OverviewHeader />

      {/* new */}

      <div className="p-[16px]">
        <div className="relative h-[calc(100vh-101px)] overflow-hidden rounded-[16px] border bg-[#fff]">
          <StatisticsFiltered myAccount={myAccount} />
          <StatisticsSchedule
            options={{
              account_id: searchParams?.mid || '',
              dw: searchParams?.dw || '',
              as: searchParams?.as || '',
              schedule,
              accounts: scheduleAsMembers,
              workflows: scheduleAsWorkflows,
              departments,
              currentDate,
              workflowCategories,
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
