'use server'

import { addDepartmentSalary, getDepartments } from '@/libs/department'

export const getDepartmentListRequest = async () => {
  return await getDepartments()
}

export const addDepartmentSalaryRequest = async (data: any) => {
  return await addDepartmentSalary(data)
}
