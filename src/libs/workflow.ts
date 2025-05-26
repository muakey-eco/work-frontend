import { requestWithAuthorized } from './request'

export const moveWorkflow = async (id: number, data: any) => {
  return await requestWithAuthorized(`workflows/${id}`, {
    method: 'PUT',
    data,
  })
}
export const moveNextStage = async (id: number, data: any) => {
  return await requestWithAuthorized(`tasks/${id}?next_stage=1`, {
    method: 'PUT',
    data,
  })
}
export const movePreviousStage = async (id: number, data: any) => {
  return await requestWithAuthorized(`tasks/${id}?previous_stage=1`, {
    method: 'PUT',
    data,
  })
}
export const movetoFirstStage = async (id: number, data: any) => {
  return await requestWithAuthorized(`tasks/${id}?first_stage=1`, {
    method: 'PUT',
    data,
  })
}
