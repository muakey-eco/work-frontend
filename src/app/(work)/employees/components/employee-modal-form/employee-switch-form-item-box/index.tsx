import clsx from 'clsx'
import React from 'react'
import EmployeeContactSwitchFormItem from './EmployeeContactSwitchFormItem'
import EmployeeEduInformationSwitchFormItem from './EmployeeEduInformationSwitchFormItem'
import EmployeeHistorySwitchFormItem from './EmployeeHistorySwitchFormItem'
import EmployeeLegalInformationSwitchFormItem from './EmployeeLegalInformationSwitchFormItem'
import EmploySalarySwitchFormItem from './EmploySalarySwitchFormItem'

type StateType = {
  shouldShowSalary: boolean
  shouldShowLegal: boolean
  shouldShowEducation: boolean
  shouldShowHistory: boolean
  shouldShowContact: boolean
}

export type EmployeeSwitchFormItemBoxProps = {
  className?: string
  state?: StateType
}

const EmployeeSwitchFormItemBox: React.FC<EmployeeSwitchFormItemBoxProps> = ({
  className,
  state,
}) => {
  const {
    shouldShowSalary,
    shouldShowLegal,
    shouldShowEducation,
    shouldShowHistory,
    shouldShowContact,
  } = state || {}

  return (
    <div className={clsx('space-y-[16px]', className)}>
      <EmploySalarySwitchFormItem checked={shouldShowSalary} />
      <EmployeeLegalInformationSwitchFormItem checked={shouldShowLegal} />
      <EmployeeEduInformationSwitchFormItem checked={shouldShowEducation} />
      <EmployeeHistorySwitchFormItem checked={shouldShowHistory} />
      <EmployeeContactSwitchFormItem checked={shouldShowContact} />
    </div>
  )
}

export default EmployeeSwitchFormItemBox
