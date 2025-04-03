'use client'

import { Card, CardProps } from 'antd'
import React from 'react'
import WorkPauseHistoryTable from './WorkPauseHistoryTable'

export type WorkPauseHistoryCardProps = CardProps & {
  title?: string
  user?: any
  dataTable?: any[]
}

const WorkPauseHistoryCard: React.FC<WorkPauseHistoryCardProps> = ({
  title,
  user,
  dataTable,
  ...props
}) => {
  return (
    <Card classNames={{ body: '!space-y-[16px]' }} {...props}>
      <div className="text-[20px] leading-[28px] font-[500]">{title}</div>

      <WorkPauseHistoryTable dataTable={dataTable} />
    </Card>
  )
}

export default WorkPauseHistoryCard
