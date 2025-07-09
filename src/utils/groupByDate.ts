import { Notification } from '@/types/notification'
import dayjs from 'dayjs'

export const groupByDate = (notifications: Notification[] = []) => {
  const groups: Record<string, Notification[]> = {}

  Array.from(notifications)?.forEach((item: Notification) => {
    const dateKey = dayjs(item.created_at).format('DD/MM/YYYY')
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(item)
  })

  return groups
}
