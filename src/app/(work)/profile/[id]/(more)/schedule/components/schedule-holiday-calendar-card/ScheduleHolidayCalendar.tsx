'use client'

import { cn } from '@/lib/utils'
import { Calendar, CalendarProps } from 'antd'
import { createStyles } from 'antd-style'
import locale from 'antd/es/date-picker/locale/vi_VN'
import dayjs from 'dayjs'
import React, { useEffect, useMemo, useState } from 'react'

import CalendarDropdown from '@/app/(work)/check-in/components/CalendarDropdown'
import { GLOBAL_BAN } from '@/libs/constant'
import { generateTimestamp } from '@/utils/generateTimestamp'
import dayjsLocale from 'dayjs/locale/vi'
import relativeTime from 'dayjs/plugin/relativeTime'
import { times } from 'lodash'
import { useSearchParams } from 'next/navigation'

export type ScheduleHolidayCalendarProps = CalendarProps<any> & {
  options?: any
  onDateSelect?: (date: any) => void
}

const useStyle = createStyles(({ css, prefixCls }) => {
  return {
    customCalendar: css`
      .${prefixCls}-picker-panel {
        border: 0 !important;
      }
      .${prefixCls}-picker-body {
        padding: 0 !important;
        .${prefixCls}-picker-content {
          tbody {
            tr {
              td {
                padding: 0 !important;
              }
              & > :first-child {
                border-left: solid 1px #0505050f;
              }
            }
          }
          thead {
            tr {
              th {
                padding: 12px 0;
                font-weight: 600;
                text-align: center;
                border-top: solid 1px #0505050f;
                padding: 12px 8px !important;
              }
              & > :not(:last-child) {
                border-right: solid 1px #0505050f;
              }
              & > :first-child {
                border-left: solid 1px #0505050f;
              }
            }
          }
        }
      }
    `,
  }
})

const ScheduleHolidayCalendar: React.FC<ScheduleHolidayCalendarProps> = ({
  options,
  onDateSelect,
  ...props
}) => {
  const { styles } = useStyle()
  const searchParams = useSearchParams()

  const today = useMemo(() => new Date(), [])
  const [date, setDate] = useState<any>(dayjs(today))
  const year = new Date().getFullYear()
  const month = options?.day || new Date().getMonth() + 1

  dayjs.extend(relativeTime)
  dayjs.locale(dayjsLocale)

  const dateParams = searchParams?.get('date')
  const dateNumber = new Date(year, month, 0).getDate()

  const { user, workSchedule, attendances } = options

  const checkInDataSource = options?.members
    ?.filter((m: any) => !GLOBAL_BAN.includes(m?.full_name))
    ?.map((m: any) => {
      const checkInHistories = attendances?.attendances?.filter(
        (a: any) => a?.account_id === m?.id,
      )

      const otPropose = attendances?.ot_and_holiday
        .filter((p: any) => p?.name_category === 'Đăng ký OT')
        .filter((p: any) => p?.account_id === user.id)

      const timeOffPropose = attendances?.ot_and_holiday
        .filter((p: any) => p?.name_category === 'Đăng ký nghỉ')
        .filter((p: any) => p?.account_id === user.id)

      const wfhPropose = attendances?.ot_and_holiday
        .filter((p: any) => p?.name === 'Đăng ký WFH')
        .filter((p: any) => p?.account_id === user.id)

      const fields = times(dateNumber, (num): any => {
        const currentDate = num + 1

        const checkIn = checkInHistories?.filter(
          (c: any) => new Date(c?.checkin).getDate() == num + 1,
        )

        const checkInValue =
          checkIn?.length >= 1
            ? checkIn?.map((c: any) => [
                dayjs(c?.checkin).format('HH:mm'),
                c?.checkout ? dayjs(c?.checkout).format('HH:mm') : null,
              ])
            : null

        const timeOff = timeOffPropose?.map((t: any) =>
          generateTimestamp(
            t?.start_date,
            t?.end_date,
            `${dateParams ? dateParams : dayjs(today).format('YYYY-MM')}-${currentDate > 9 ? currentDate : `0${currentDate}`}`,
          ),
        )

        const ot = otPropose?.map((t: any) =>
          generateTimestamp(
            t?.start_date,
            t?.end_date,
            `${dateParams ? dateParams : dayjs(today).format('YYYY-MM')}-${currentDate > 9 ? currentDate : `0${currentDate}`}`,
          ),
        )

        const wfh = wfhPropose?.map((t: any) =>
          generateTimestamp(
            t?.start_date,
            t?.end_date,
            `${dateParams ? dateParams : dayjs(today).format('YYYY-MM')}-${currentDate > 9 ? currentDate : `0${currentDate}`}`,
          ),
        )

        const hoursPerDay = checkIn?.reduce((total: number, curr: any) => {
          return total + (+curr?.hours || 0)
        }, 0)

        const dayWorking = checkIn?.reduce((total: number, curr: any) => {
          return total + (+curr?.workday || 0)
        }, 0)

        const timeWork =
          attendances?.attendances?.find(
            (s: any) =>
              new Date(s?.checkin).getDate() == num + 1 &&
              new Date(s?.checkin).getMonth() + 1 === month &&
              new Date(s?.checkin).getFullYear() === year,
          )?.workday || 0
        const roundedTimeWork = Number(timeWork) === 1 ? 1 : timeWork

        return [
          `${currentDate}/${month}`,
          {
            checkInValue,
            timeOff,
            ot,
            wfh,
            hoursPerDay,
            dayWorking,
            timeWork: roundedTimeWork,
            plan_time: checkIn?.[0]
              ? [
                  dayjs(checkIn?.[0]?.checkin).format('HH:mm'),
                  dayjs(checkIn?.[0]?.check_out_regulation).format('HH:mm'),
                ]
              : [],
          },
        ]
      })

      return {
        member: {
          fullName: m?.full_name,
          avatar: m?.avatar,
          workDay: m?.workday,
          ot: m?.hours_over_time,
          wfh: m?.work_from_home,
        },
        ...Object.fromEntries(fields),
      }
    })

  useEffect(() => {
    setDate(dayjs(searchParams?.get('date') || today))
  }, [today, searchParams])

  const checkInData = checkInDataSource?.find(
    (c: any) => c?.member?.fullName === user?.full_name,
  )

  return (
    <Calendar
      className={cn(styles.customCalendar, '!h-full w-full')}
      headerRender={() => <></>}
      value={date}
      fullCellRender={(current) => {
        const timestamp = dayjs(current).format('D/M')
        const info = checkInData?.[String(timestamp)] || []

        const date = String(dayjs(current).format('YYYY-MM-DD'))

        const day = workSchedule?.find((s: any) => s?.day_of_week === date)

        const isCurrentMonth =
          String(dayjs(current).format('YYYY-MM')) ===
          (dateParams || dayjs(new Date()).format('YYYY-MM'))

        return (
          <CalendarDropdown
            currentDate={current}
            month={day}
            options={{
              isCurrentMonth,
              info,
            }}
            isProfile={true}
            onDateClick={(date) => {
              onDateSelect?.(date)
            }}
          />
        )
      }}
      locale={locale}
      {...props}
    />
  )
}

export default ScheduleHolidayCalendar
