import { formatCurrency } from '@/lib/utils'
import { EditOutlined } from '@ant-design/icons'
import { Button, Card, ListProps } from 'antd'
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
  const { salary } = externalData

  const insurance = Number(salary?.basic_salary * 0.215)
  const insuranceEmployee = Number(salary?.basic_salary * 0.105)

  const netSalary =
    salary?.basic_salary +
    salary?.travel_allowance +
    salary?.eat_allowance +
    salary?.kpi

  const grossSalary = netSalary + insurance + insuranceEmployee

  const data: ListProps<any>['dataSource'] = [
    {
      label: 'Lương Gross',
      value: isNaN(grossSalary) ? '--' : `${formatCurrency(grossSalary)} đ`,
    },
    {
      label: 'Lương Net',
      value: isNaN(netSalary) ? '--' : `${formatCurrency(netSalary)} đ`,
    },
    {
      label: 'BHXH, BHYT, BHTN do CTY đóng (21,5%)',
      value: isNaN(insurance) ? '--' : `${formatCurrency(insurance)} đ`,
    },
    {
      label: 'BHXH, BHYT, BHTN do NLĐ đóng (10,5%)',
      value: isNaN(insuranceEmployee)
        ? '--'
        : `${formatCurrency(insuranceEmployee)} đ`,
    },
    {
      label: 'Lương cơ bản',
      value: salary?.basic_salary
        ? `${formatCurrency(salary?.basic_salary)} đ`
        : '--',
    },
    {
      label: 'Phụ cấp đi lại',
      value: salary?.travel_allowance
        ? `${formatCurrency(salary?.travel_allowance)} đ`
        : '--',
    },
    {
      label: 'Phụ cấp ăn uống',
      value: salary?.eat_allowance
        ? `${formatCurrency(salary?.eat_allowance)} đ`
        : '--',
    },
    {
      label: 'Thưởng KPI',
      value: salary?.kpi ? `${formatCurrency(salary?.kpi)} đ` : '--',
    },
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
          <JobSalaryModalForm initialValues={externalData}>
            <Button icon={<EditOutlined />}>Chỉnh sửa</Button>
          </JobSalaryModalForm>
        )}
      </div>

      <JobSalaryList dataSource={data} />
    </Card>
  )
}

export default JobSalaryCard
