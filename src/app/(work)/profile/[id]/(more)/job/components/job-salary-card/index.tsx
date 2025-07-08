'use client'

import CheckPasswordModal from '@/components/CheckPasswordModal'
import { formatCurrency } from '@/lib/utils'
import { EditOutlined, EyeOutlined } from '@ant-design/icons'
import { Button, Card, ListProps } from 'antd'
import { useRouter } from 'next/navigation'
import React from 'react'
import JobSalaryList from './JobSalaryList'
import JobSalaryModalForm from './JobSalaryModalForm'

export type JobSalaryCardProps = {
  title?: React.ReactNode
  extra?: React.ReactNode
  data?: any
}

const JobSalaryCard: React.FC<JobSalaryCardProps> = ({
  title,
  extra,
  data: externalData,
}) => {
  const { salary, status } = externalData
  const router = useRouter()
  const DISABLED_SALARY_FIELDS = {
    insurance_employee: 567000,
  }

  const data: ListProps<any>['dataSource'] = [
    {
      label: 'Lương cơ bản',
      value: salary?.basic_salary
        ? `${formatCurrency(salary?.basic_salary)} đ`
        : '--',
    },

    ...(status !== 'Thử việc'
      ? [
          // {
          //   label: 'BHXH, BHYT, BHTN do CTY đóng (21,5%)',
          //   value: `${formatCurrency(DISABLED_SALARY_FIELDS.insurance)} đ`,
          // },
          {
            label: 'BHXH, BHYT, BHTN do NLĐ đóng (10,5%)',
            value: `${formatCurrency(DISABLED_SALARY_FIELDS.insurance_employee)} đ`,
          },
        ]
      : []),
  ]

  return (
    <Card
      classNames={{
        body: 'space-y-[16px]!',
      }}
    >
      <div className="mt-[16px] flex items-center justify-between">
        <div className="text-[20px] leading-[28px] font-[500]">{title}</div>
        {extra || (
          <div className="flex items-center gap-4">
            <CheckPasswordModal link={`/profile/${externalData.id}/salary`}>
              <Button icon={<EyeOutlined />}>Xem bảng lương</Button>
            </CheckPasswordModal>
            <JobSalaryModalForm initialValues={externalData}>
              <Button icon={<EditOutlined />} onClick={() => {}}>
                Chỉnh sửa
              </Button>
            </JobSalaryModalForm>
          </div>
        )}
      </div>

      <JobSalaryList dataSource={data} />
    </Card>
  )
}

export default JobSalaryCard
