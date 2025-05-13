import { requestWithAuthorized } from './request'

export const seenNotifications = async () => {
  return await requestWithAuthorized('seen-notification', {
    method: 'PUT',
  })
}

export const getNotifications = async () => {
  return await requestWithAuthorized('notifications')
    .then((res) => res.data)
    .catch(() => [])
}

export const createNotification = async (data: any) => {
  return await requestWithAuthorized('notices', {
    method: 'POST',
    data,
  })
}

export const updateNotification = async (id: string, data: any) => {
  return await requestWithAuthorized(`notices/${id}`, {
    method: 'PUT',
    data,
  })
}
