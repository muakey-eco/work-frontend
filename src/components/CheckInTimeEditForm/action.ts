'use server'

import { getAttendanceByDate } from '@/libs/data'

export const getAttendancesAction = async (date: string) => {
  const attendances = await getAttendanceByDate(date)
  return attendances
}
