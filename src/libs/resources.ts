import { requestWithAuthorized } from './request'

export const getResourceCategories = async (search?: string) => {
  return await requestWithAuthorized('resource-categories', {
    params: { search },
  })
    .then((data) => data)
    .catch(() => [])
}

export const getResourceCategory = async (id: number) => {
  return await requestWithAuthorized(`resource-categories/${id}`)
    .then((data) => data)
    .catch(() => null)
}

export const createResourceCategory = async (data: any) => {
  return await requestWithAuthorized('resource-categories', {
    method: 'POST',
    data,
  })
}

export const updateResourceCategory = async (id: number, data: any) => {
  return await requestWithAuthorized(`resource-categories/${id}`, {
    method: 'PUT',
    data,
  })
}

export const deleteResourceCategory = async (id: number) => {
  return await requestWithAuthorized(`resource-categories/${id}`, {
    method: 'DELETE',
  })
}

export const getResources = async () => {
  return await requestWithAuthorized('resources')
    .then((data) => data)
    .catch(() => [])
}

export const getResource = async (id: number) => {
  return await requestWithAuthorized(`resources/${id}`)
    .then((data) => data)
    .catch(() => null)
}

export const createResource = async (data: any) => {
  return await requestWithAuthorized('resources', {
    method: 'POST',
    data,
  })
}

export const updateResource = async (id: number, data: any) => {
  return await requestWithAuthorized(`resources/${id}`, {
    method: 'PUT',
    data,
  })
}

export const deleteResource = async (id: number) => {
  return await requestWithAuthorized(`resources/${id}`, {
    method: 'DELETE',
  })
}
