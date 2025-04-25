import { requestWithAuthorized } from './request'

export const getPauseHistory = async (accountId: number, type: string) => {
  return await requestWithAuthorized(
    `leave-histories?account_id=${accountId}&type=${type}`,
  )
    .then((data) => data)
    .catch(() => null)
}

export const getEmployee = async (query?: any) => {
  return requestWithAuthorized(`employees?` + new URLSearchParams(query))
    .then((data) => data)
    .catch(() => [])
}

export const deleteTab = async (id: string) => {
  return requestWithAuthorized(`views/${id}`, {
    method: 'DELETE',
  })
    .then((data) => data)
    .catch(() => null)
}
export const updateTab = async (data: any) => {
  return requestWithAuthorized(`update-index-views`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((data) => data)
    .catch((err) => {
      console.error('updateTab error:', err)
      return null
    })
}
