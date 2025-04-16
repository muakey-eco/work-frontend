'use server'

import { getDepartments } from '@/libs/department'

export const getDepartmentListRequest = async () => {
  return await getDepartments()
}
