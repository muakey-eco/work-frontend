'use server'

import { disableAccount } from '@/libs/account'
import { addAccount, deleteAccount, editAccount } from '@/libs/data'
import { getEmployee } from '@/libs/employee'
import { getRoles } from '@/libs/role'

export const addAccountAction = async (account: any) => {
  return await addAccount(account)
}

export const editAccountAction = async (id: number, account: any) => {
  return await editAccount(id, account)
}

export const deleteAccountAction = async (id: number) => {
  return await deleteAccount(id)
}

export const getRolesRequest = async () => {
  return await getRoles()
}

export const getAccountsRequest = async (query?: any) => {
  return await getEmployee(query)
}

export const disableAccountAction = async (id: number) => {
  return await disableAccount(id)
}
