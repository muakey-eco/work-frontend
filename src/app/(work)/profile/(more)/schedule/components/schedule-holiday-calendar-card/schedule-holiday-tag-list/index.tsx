import { List, ListProps } from 'antd'
import React from 'react'
import ScheduleHolidayTag from './ScheduleHolidayTag'

export type ScheduleHolidayTagListProps = ListProps<any> & {
  isToday?: boolean
}

const genType = (type: string) => {
  switch (type) {
    case 'planTime':
      return 'info'
    case 'realTime':
      return 'success'
  }
}

const ScheduleHolidayTagList: React.FC<ScheduleHolidayTagListProps> = ({
  dataSource,
  isToday,
  ...props
}) => {
  return (
    <List
      grid={{
        gutter: [4, 4],
        column: 1,
      }}
      dataSource={dataSource}
      locale={{
        emptyText: <></>,
      }}
      renderItem={(item) => {
        const isMissAttendance =
          (!item?.value?.[0] || !item?.value?.[1]) && !isToday

        return (
          <ScheduleHolidayTag
            type={isMissAttendance ? 'error' : genType(item?.key)}
          >
            {item?.value?.[0] || '--:--'} - {item?.value?.[1] || '--:--'}
          </ScheduleHolidayTag>
        )
      }}
      {...props}
    />
  )
}

export default ScheduleHolidayTagList
