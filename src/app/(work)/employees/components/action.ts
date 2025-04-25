'use server'

import { addStaff, getAccountById } from '@/libs/account'
import { getAccountsAsAttendance, getBankList, uploadFiles } from '@/libs/data'
import { deleteTab, getEmployee, updateTab } from '@/libs/employee'
import { createView, getViewFields, getViewFieldsById, updateView } from '@/libs/view'

export const getViewFieldsAction = async (query?: any) => {
  return await getViewFields(query)
}

export const getViewFieldsByIdAction = async (id: string) => {
  return await getViewFieldsById(id)
}

export const createViewAction = async (data: any) => {
  return await createView(data)
}

export const updateViewAction = async (id: string, data: any) => {
  return await updateView(id, data)
}

export const getBankListRequest = async () => {
  return await getBankList()
}

export const getAccountsAsAttendanceAction = async () => {
  return await getAccountsAsAttendance()
}

export const uploadFilesAction = async (data: any) => {
  return await uploadFiles(data)
}

export const addStaffAction = async (data: any, body?: FormData) => {
  return await addStaff(data, body)
}

export const getAccountByIdAction = async (id: number, query?: any) => {
  return await getAccountById(id, query)
}

export const getEmployeeAction = async (query?: any) => {
  return await getEmployee(query)
}

export const deleteTabAction = async (id: string) => {
  return await deleteTab(id)
}
export const updateTabAction = async (data: any) => {
  return await updateTab(data)
}
