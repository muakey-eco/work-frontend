import { requestWithAuthorized } from './request'

export const getViews = async (query?: any) => {
  return await requestWithAuthorized(`views?` + new URLSearchParams(query))
    .then((data) => data)
    .catch(() => [])
}

export const createView = async (data: any) => {
  return await requestWithAuthorized('views', {
    method: 'POST',
    data,
  })
}

export const updateView = async (id: string, data: any) => {
  return await requestWithAuthorized(`views/${id}`, {
    method: 'PUT',
    data,
  })
}

export const getViewFields = async (query?: any) => {
  return await requestWithAuthorized(
    `account-fields?` + new URLSearchParams(query),
  )
    .then((data) => data)
    .catch(() => [])
}

export const getViewFieldsById = async (id: string) => {
  return await requestWithAuthorized(`views/${id}`)
    .then((data) => data)
    .catch(() => [])
}
