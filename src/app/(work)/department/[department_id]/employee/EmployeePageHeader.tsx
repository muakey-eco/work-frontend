'use client'

import { PageHeader } from '@/components'
import { PlusOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import DepartmentModalForm from '../../components/DepartmentModalForm'

const EmployeePageHeader = ({
  department_id,
  members,
  accounts,
}: {
  department_id: string
  members: {
    name: string
    members: {
      id: number
      full_name: string
      position: string
      gender: string
    }
  }
  accounts: any[]
}) => {
  const newMembers = accounts
    ?.filter((account) => account?.id !== members?.members?.id)
    .filter((account) => account?.quit_work !== 1)
  return (
    <div>
      <PageHeader
        title="Thành viên"
        extra={
          <DepartmentModalForm
            action="edit"
            options={{
              id: department_id,
              members: newMembers,
              initialValues: {
                name: members?.name, //tên phòng ban
                members: members?.members, //thành viên cũ
              },
            }}
          >
            <Button type="primary" icon={<PlusOutlined />}>
              Thêm thành viên
            </Button>
          </DepartmentModalForm>
        }
      />
    </div>
  )
}

export default EmployeePageHeader
