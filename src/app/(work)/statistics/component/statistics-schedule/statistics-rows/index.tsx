import React from 'react'
import StatisticsRowsStaff from './StatisticsRowsStaff'
import StatisticsRowsWorkflow from './StatisticsRowsWorkflow'
import StatisticsRowsDepartment from './StatisticsRowsDepartment'

type StatisticsRowsProps = {
  type: 'staff' | 'workflow' | 'department'
  options: any
}

const StatisticsRows: React.FC<StatisticsRowsProps> = ({ type, options }) => {
  const { todosWithAccounts, todosWithWorkflows, todosWithDepartments, ...rest } = options

  switch (type) {
    case 'staff':
      return <StatisticsRowsStaff todos={todosWithAccounts} options={rest} />
    case 'workflow':
      return (
        <StatisticsRowsWorkflow todos={todosWithWorkflows} options={rest} />
      )
    case 'department':
      return (
        <StatisticsRowsDepartment todos={todosWithDepartments} options={rest} />
      )
    default:
      return <></>
  }
}

export default StatisticsRows
