'use client'

import { List, ListProps } from 'antd'
import React from 'react'

export type JobSalaryListProps = ListProps<any> & {}

const JobSalaryList: React.FC<JobSalaryListProps> = (props) => {
  return (
    <List
      grid={{
        gutter: 16,
        column: 4,
      }}
      renderItem={(item) => (
        <List.Item>
          <div className="space-y-[8px]">
            <div className="text-[14px] font-[400] leading-[22px] text-[#00000073]">
              {item.label}
            </div>
            <div className="text-[14px] font-[600] leading-[22px] text-[#000000D9]">
              {item.value}
            </div>
          </div>
        </List.Item>
      )}
      {...props}
    />
  )
}

export default JobSalaryList
