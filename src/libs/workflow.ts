import { requestWithAuthorized } from './request'

export const moveWorkflow = async (id: number, data: any) => {
  return await requestWithAuthorized(`workflows/${id}`, {
    method: 'PUT',
    data,
  })
}
