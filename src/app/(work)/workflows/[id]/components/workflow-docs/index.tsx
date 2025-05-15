'use client'

import { DatePicker, DatePickerProps } from 'antd'
import React from 'react'
import AverageTimeBarChart from './StatsGrid/AverageTimeBarChart'
import TaskStatsByPhaseTable from './StatsGrid/TaskStatsByPhaseTable'
import TaskSummaryPieChart from './StatsGrid/TaskSummaryPieChart'
import UserStats from './UserStats'

type WorkflowDocsProps = {
  stages?: any
}

const WorkflowDocs: React.FC<WorkflowDocsProps> = ({ stages }) => {
  const onChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString)
  }
  return (
    <div className="flex flex-col gap-[16px] bg-[#F5F5F5] p-[16px]">
      <DatePicker
        onChange={onChange}
        picker="month"
        placeholder="Chọn tháng"
        className="!w-[228px]"
      />
      <div className="flex gap-[16px]">
        <TaskSummaryPieChart />
        <AverageTimeBarChart />
      </div>
      <TaskStatsByPhaseTable />
      <div className="flex gap-[16px]">
        <UserStats
          title="Người thực thi xuất sắc"
          description="lần hoàn thành đúng hạn"
          progress
        />
        <UserStats
          title="Người được giao nhiều nhất"
          description="lần được giao"
        />
        <UserStats
          title="Người làm muộn nhiều nhất"
          description="lần hoàn thành muộn"
        />
      </div>
    </div>
  )
}

export default WorkflowDocs
