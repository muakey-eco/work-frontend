import { addAccount, deleteAccount, editAccount, uploadImage } from './data'
import { requestWithAuthorized } from './request'
import { getRoles } from './role'

export const disableAccount = async (id: number) => {
  return await requestWithAuthorized(`disable-account/${id}`, {
    method: 'PUT',
  })
}

export const activeAccount = async (id: number) => {
  return await requestWithAuthorized(`active-account/${id}`, {
    method: 'PUT',
  })
}

export const getAccountById = async (id: number, query?: any) => {
  return await requestWithAuthorized(
    `accounts/${id}?` + new URLSearchParams(query),
  )
    .then((data) => data)
    .catch(() => null)
}

export const updateAccount = async (
  id: number,
  data: any,
  formData?: FormData,
) => {
  return await requestWithAuthorized(`accounts/${id}`, {
    method: 'PUT',
    data,
    body: formData,
  })
}

export const addStaff = async (data: any, formData?: FormData) => {
  return await requestWithAuthorized(`staffs`, {
    method: 'POST',
    data,
    body: formData,
  })
}

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
