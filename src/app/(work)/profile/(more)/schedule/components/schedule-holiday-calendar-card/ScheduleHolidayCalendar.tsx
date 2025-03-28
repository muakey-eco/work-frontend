'use client'

import { cn } from '@/lib/utils'
import { Calendar, CalendarProps } from 'antd'
import { createStyles } from 'antd-style'
import locale from 'antd/es/date-picker/locale/vi_VN'
import clsx from 'clsx'
import dayjs from 'dayjs'
import React from 'react'
import ScheduleHolidayTagList from './schedule-holiday-tag-list'

export type ScheduleHolidayCalendarProps = CalendarProps<any> & {
  data?: any
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
  data,
  ...props
}) => {
  const { styles } = useStyle()
  const today = String(dayjs(new Date()).format('DD/MM'))

  return (
    <Calendar
      className={cn(styles.customCalendar, '!h-full w-full')}
      headerRender={() => <></>}
      fullCellRender={(d) => {
        const date = String(d.format('DD/MM/YYYY'))
        const day = String(d.format('DD/MM'))
        const month = String(d.format('MM'))

        const currentMonth = String(dayjs(new Date()).format('MM'))
        const value = data?.find((item: any) => item?.checkInDay === date)

        const isToday = day === today
        const isCurrentMonth = month === currentMonth

        return (
          <div
            className={clsx(
              'h-auto min-h-[130px] w-full flex-1 border-t border-r p-[8px] text-center',
              {
                '!border-t-[#096DD9] bg-[#E6F7FF]': isToday,
              },
            )}
          >
            <div className="text-[14px] leading-[22px]!">
              {d.format('DD/MM')}
            </div>

            {isCurrentMonth && !!value && (
              <ScheduleHolidayTagList
                dataSource={value?.items}
                isToday={isToday}
              />
            )}
          </div>
        )
      }}
      locale={locale}
      {...props}
    />
  )
}

export default ScheduleHolidayCalendar
