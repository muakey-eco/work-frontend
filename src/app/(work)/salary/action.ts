'use server'

import { getSalary, reviewSalary } from '@/libs/salary'

export const getSalaryAction = async (date: string) => {
  return await getSalary(date)
}

export const reviewSalaryAction = async (data: any) => {
  return await reviewSalary(data)
}
