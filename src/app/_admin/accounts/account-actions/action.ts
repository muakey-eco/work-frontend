'use server'

import {
  addAccount,
  deleteAccount,
  editAccount,
  uploadImage,
} from '@/libs/data'
import { getRoles } from '@/libs/role'

export const addAccountAction = async (data: any) => {
  return await addAccount(data)
}

export const editAccountAction = async (id: number, data: any) => {
  return await editAccount(id, data)
}

export const deleteAccountAction = async (id: number) => {
  return await deleteAccount(id)
}

export const getRolesRequest = async () => {
  return await getRoles()
}

export const uploadImageAction = async (data: any) => {
  return await uploadImage(data)
}
