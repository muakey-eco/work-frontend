import { getViews } from '@/libs/view'
import React from 'react'
import EmployeePageHeader from './components/EmployeePageHeader'
import EmployeeTable from './components/employee-table'

const EmployeesPage: React.FC = async () => {
  const views = await getViews()

  return (
    <>
      <EmployeePageHeader tabs={views} />
      <div className="h-[calc(100vh-89px)] bg-[#F6F6F6] p-[16px]">
        <EmployeeTable columns={views} firstView={views[0]?.name} />
      </div>
    </>
  )
}

export default EmployeesPage
