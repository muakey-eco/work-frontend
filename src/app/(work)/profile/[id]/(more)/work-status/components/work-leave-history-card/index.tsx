import { Card, CardProps } from 'antd'
import React from 'react'
import WorkLeaveHistoryTable from './WorkLeaveHistoryTable'

export type WorkLeaveHistoryCardProps = CardProps & {
  title?: string
  user?: any
  dataTable?: any[]
}

const WorkLeaveHistoryCard: React.FC<WorkLeaveHistoryCardProps> = ({
  title,
  user,
  dataTable,
  ...props
}) => {
  return (
    <Card classNames={{ body: '!space-y-[16px]' }} {...props}>
      <div className="text-[20px] leading-[28px] font-[500]">{title}</div>

      <WorkLeaveHistoryTable dataTable={dataTable} />
    </Card>
  )
}

export default WorkLeaveHistoryCard
