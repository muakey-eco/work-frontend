'use server'

import { getSalary, getSalaryClose, reviewSalary } from '@/libs/salary'

export const getSalaryAction = async (date: string) => {
  return await getSalary(date)
}

export const reviewSalaryAction = async (data: any) => {
  return await reviewSalary(data)
}

export const getSalaryCloseAction = async (date: string) => {
  return await getSalaryClose(date)
}
