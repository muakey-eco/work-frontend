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
export const getSalaryClose = async (date: string) => {
  return await requestWithAuthorized(
    `salary-tables?date=${date}&salary_closed=1`,
  )
    .then((data) => data)
    .catch(() => [])
}
export const getSalaryById = async (id: number, date: string) => {
  return await requestWithAuthorized(`salary-tables/${id}?date=${date}`)
    .then((data) => data)
    .catch(() => [])
}
