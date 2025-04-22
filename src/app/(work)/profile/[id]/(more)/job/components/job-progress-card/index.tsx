'use client'

import useSeniority from '@/app/(work)/profile/hooks/useSeniority'
import { AreaChart } from '@/components'
import { PlusOutlined } from '@ant-design/icons'
import { Button, Card } from 'antd'
import React from 'react'
import JobProgressGuide from './JobProgressGuide'
import JobProgressTable from './JobProgressTable'
import JobProgressModalForm from './job-progress-modal-form'

export type JobProgressCardProps = {
  title?: string
  data?: any
  extra?: React.ReactNode
}

const JobProgressCard: React.FC<JobProgressCardProps> = ({
  title,
  data,
  extra,
}) => {
  const {
    job_position,
    full_name,
    position,
    personnel_class,
    department_name,
  } = data
  const guideItems = [
    {
      label: 'Lương khi tuyển',
      value: '--',
    },
    {
      label: 'Mức lương hiện tại',
      value:
        new Intl.NumberFormat('vi-VN', { style: 'decimal', useGrouping: true })
          .format(job_position[0]?.total_salary)
          .replace(/\./g, ',') + ' đ',
    },
    {
      label: 'Thâm niên',
      value: useSeniority(data?.start_trial_date),
    },
    {
      label: '% Tăng',
      value: ((job_position[0]?.total_salary - 2000000) / 2000000) * 100 + '%',
    },
  ]

  return (
    <Card
      classNames={{
        body: 'space-y-[16px]!',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="text-[20px] leading-[28px] font-[500]">{title}</div>
        {extra || (
          <JobProgressModalForm
            initialValues={{
              full_name,
              position,
              personnel_class,
              department_name,
            }}
          >
            <Button icon={<PlusOutlined />} type="primary">
              Tạo mới
            </Button>
          </JobProgressModalForm>
        )}
      </div>

      <div className="flex items-start gap-[16px]">
        <AreaChart data={job_position} />
        <JobProgressGuide items={guideItems} />
      </div>

      <JobProgressTable dataSource={job_position} />
    </Card>
  )
}

export default JobProgressCard
