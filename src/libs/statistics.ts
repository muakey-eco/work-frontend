import { requestWithAuthorized } from './request'

export const getSchedule = async (query?: any) =>
  requestWithAuthorized('schedule?' + new URLSearchParams(query))
    .then((data) => data)
    .catch(() => [])
