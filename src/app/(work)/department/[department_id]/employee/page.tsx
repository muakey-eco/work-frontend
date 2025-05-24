import { getAccounts } from '@/libs/account'
import { getMembersByDepartmentId } from '@/libs/department'
import EmployeePageHeader from './EmployeePageHeader'
import EmployeePageTable from './EmployeePageTable'
const EmployeePage = async ({
  params,
}: {
  params: Promise<{ department_id: string }>
}) => {
  const { department_id } = await params

  const [accounts, members] = await Promise.all([
    getAccounts(),
    getMembersByDepartmentId(department_id),
  ])
  return (
    <>
      <EmployeePageHeader
        department_id={department_id}
        members={members}
        accounts={accounts}
      />
      <EmployeePageTable members={members} />
    </>
  )
}

export default EmployeePage
