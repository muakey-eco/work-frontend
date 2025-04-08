import { END_TIME, START_TIME } from '@/libs/constant'
import dayjs from 'dayjs'

export const generateTimestamp = (
  start: string,
  end: string,
  currentDate: string,
) => {
  const startDate = dayjs(start).format('YYYY-MM-DD')
  const endDate = dayjs(end).format('YYYY-MM-DD')
  const currentDateFormatted = dayjs(currentDate).format('YYYY-MM-DD')
  if (startDate <= currentDateFormatted && endDate >= currentDateFormatted) {
    if (
      startDate === currentDateFormatted &&
      endDate === currentDateFormatted
    ) {
      const startTime = dayjs(start).format('HH:mm')
      const endTime = dayjs(end).format('HH:mm')

      return [startTime, endTime]
    }

    if (startDate === currentDateFormatted) {
      const startTime = dayjs(start).format('HH:mm')

      return [startTime, END_TIME]
    }

    if (currentDateFormatted > startDate && currentDateFormatted < endDate) {
      return [START_TIME, END_TIME]
    }

    if (currentDateFormatted === endDate) {
      const endTime = dayjs(end).format('HH:mm')

      return [START_TIME, endTime]
    }
  }

  return null
}
