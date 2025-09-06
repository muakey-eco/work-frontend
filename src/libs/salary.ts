import { requestWithAuthorized } from './request'

export const getSalary = async (date: string) =>
  requestWithAuthorized(`salary-tables?date=${date}`)
    .then((data) => data)
    .catch(() => [])

export const reviewSalary = async (data: any) => {
  return await requestWithAuthorized(`salary-tables`, {
    method: 'POST',
    data,
  })
}
