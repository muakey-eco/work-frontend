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
