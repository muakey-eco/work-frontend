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
