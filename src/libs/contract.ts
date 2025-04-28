import { requestWithAuthorized } from './request'

export const addContract = async (data: any, options?: any) => {
  const { body } = options || {}

  return await requestWithAuthorized('contracts', {
    method: 'POST',
    data,
    ...(body ? { body } : {}),
  })
}

export const getContractCategories = async () => {
  return await requestWithAuthorized('contract-categories', {
    method: 'GET',
  })
    .then((data) => data)
    .catch(() => [])
}

export const updateContract = async (id: number, data: any, options?: any) => {
  const { body } = options || {}

  return await requestWithAuthorized(`contracts/${id}`, {
    method: 'PUT',
    data,
    ...(body ? { body, headers: {} } : {}),
  })
}

export const addContractCategory = async (data: any) => {
  return await requestWithAuthorized('contract-categories', {
    method: 'POST',
    data,
  })
}
