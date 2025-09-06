'use server'

import { getSalaryById } from '@/libs/salary'

export const getSalaryByIdAction = async (id: number, date: string) => {
  return await getSalaryById(id, date)
}
