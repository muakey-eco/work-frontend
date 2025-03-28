'use server'

import { addStaff, getAccountById } from '@/libs/account'
import { getAccountsAsAttendance, getBankList, uploadFiles } from '@/libs/data'
import { createView, getViewFields } from '@/libs/view'

export const getViewFieldsAction = async (query?: any) => {
  return await getViewFields(query)
}

export const createViewAction = async (data: any) => {
  return await createView(data)
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
