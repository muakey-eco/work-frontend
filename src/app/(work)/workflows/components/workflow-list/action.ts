'use server'

import { getAccounts } from '@/libs/data'
import { getDepartmentById } from '@/libs/department'
import { moveWorkflow } from '@/libs/workflow'
export const getDepartmentByIdAction = async (id: number) => {
  return await getDepartmentById(id)
}

export const getAccountsRequest = async () => {
  return await getAccounts()
}

export const moveWorkflowAction = async (id: number, data: any) => {
  return await moveWorkflow(id, data)
}
