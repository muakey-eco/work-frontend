'use server'

import {
  deleteImportantNotification,
  getImportantNotification,
  hideImportantNotification,
} from '@/libs/data'
import { createNotification, updateNotification } from '@/libs/notifications'

export const createNotificationAction = async (data: any) => {
  return await createNotification(data)
}

export const updateNotificationAction = async (id: string, data: any) => {
  return await updateNotification(id, data)
}

export const getImportantNotificationAction = async (query?: any) => {
  return await getImportantNotification(query)
}

export const deleteImportantNotificationAction = async (id: number) => {
  return await deleteImportantNotification(id.toString())
}

export const hideImportantNotificationAction = async (id: number) => {
  return await hideImportantNotification(id, { is_hidden: true })
}
