import { requestWithAuthorized } from './request'

export const disableAccount = async (id: number) => {
  return await requestWithAuthorized(`disable-account/${id}`, {
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
