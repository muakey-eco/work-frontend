'use server'

import { getAccountById, updateAccount } from '@/libs/account'
import {
  addContract,
  getContractCategories,
  updateContract,
} from '@/libs/contract'
import { editAccount, getBankList, uploadFiles } from '@/libs/data'
import { getDepartments } from '@/libs/department'
import { getLoginHistory } from '@/libs/login-history'

export const getBankListRequest = async () => {
  return await getBankList()
}

export const updateProfileAction = async (id: number, data: any) => {
  return await editAccount(id, data)
}

export const getDepartmentListRequest = async () => {
  return await getDepartments()
}

export const addContractAction = async (data: any, options?: any) => {
  return await addContract(data, options)
}

export const updateContractAction = async (
  id: number,
  data: any,
  options?: any,
) => {
  return await updateContract(id, data, options)
}

export const getContractCategoriesAction = async () => {
  return await getContractCategories()
}

export const getAccountByIdAction = async (id: number) => {
  return await getAccountById(id)
}

export const updateAccountAction = async (
  id: number,
  data: any,
  formData?: FormData,
) => {
  return await updateAccount(id, data, formData)
}

export const uploadFilesAction = async (data: FormData) => {
  return await uploadFiles(data)
}

export const getLoginHistoryAction = async (page: number) => {
  return await getLoginHistory(page);
}
