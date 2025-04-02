import { requestWithAuthorized } from './request'

export const getLoginHistory = async (page: number, pageSize: number) => {
  return await requestWithAuthorized(
    `login-histories?page=${page}&per_page=${pageSize}`,
  )
    .then((data) => data)
    .catch(() => null)
}
