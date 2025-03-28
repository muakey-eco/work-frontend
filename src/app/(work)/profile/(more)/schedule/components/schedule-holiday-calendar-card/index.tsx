import { Card, CardProps } from 'antd'
import dayjs from 'dayjs'
import React from 'react'
import ScheduleHolidayCalendar from './ScheduleHolidayCalendar'
import ScheduleHolidayCalendarFilter from './ScheduleHolidayCalendarFilter'
import ScheduleHolidayCalendarGuide from './ScheduleHolidayCalendarGuide'

export type ScheduleHolidayCalendarCardProps = CardProps & {
  data?: any
}

const ScheduleHolidayCalendarCard: React.FC<
  ScheduleHolidayCalendarCardProps
> = ({ data, ...props }) => {
  const { attendances, ot_and_holiday } = data

  const attendancesData = attendances?.map((attend: any) => {
    return {
      items: [
        {
          key: 'planTime',
          value: [
            dayjs(attend?.checkin).format('HH:mm'),
            dayjs(attend?.check_out_regulation).format('HH:mm'),
          ],
        },
        {
          key: 'realTime',
          value: [
            dayjs(attend?.checkin).format('HH:mm'),
            attend?.checkout ? dayjs(attend?.checkout).format('HH:mm') : null,
          ],
        },
      ],
      checkInDay: String(dayjs(attend?.checkin).format('DD/MM/YYYY')),
    }
  })

  console.log('DATA ->', data)

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

      <ScheduleHolidayCalendar data={attendancesData} />
    </Card>
  )
}

export default ScheduleHolidayCalendarCard
