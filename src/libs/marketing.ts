import { requestWithAuthorized } from './request'

export const getMarketingData = async () => {
  return await requestWithAuthorized('affiliates')
    .then((data) => data)
    .catch(() => [])
}
