import {
  request,
  RequestOptions,
  requestWithAuthorized,
  requestWithFile,
} from './request'
import { getSession } from './session'

export const getWorkflows = async (query?: any) => {
  return requestWithAuthorized('workflows?' + new URLSearchParams(query))
    .then((data) => data)
    .catch(() => [])
}

export const getWorkflowById = async (id: number, options?: RequestOptions) => {
  return requestWithAuthorized(`workflows/${id}`, { ...options })
    .then((data) => data)
    .catch(() => [])
}

export const getWorkflowMembersById = async (id: number) => {
  return requestWithAuthorized(`workflows-members/${id}`)
    .then((data) => data)
    .catch(() => [])
}

export const getStagesByWorkflowId = async (
  query?: any,
  options?: RequestOptions,
) => {
  return requestWithAuthorized('stages?' + new URLSearchParams(query), {
    ...options,
  })
    .then((data) => data)
    .catch(() => [])
}

export const getWorkflowCategories = async () => {
  return await requestWithAuthorized('workflow-categories')
    .then((data) => data)
    .catch(() => [])
}

export const getWorkflowCategoryById = async (id: number) => {
  return await requestWithAuthorized(`workflow-categories/${id}`)
    .then((data) => data)
    .catch(() => [])
}

export const getWorkflowMembers = async (id: number) => {
  return requestWithAuthorized(`workflows-members/${id}`)
    .then((data) => data)
    .catch(() => [])
}

export const addWorkflow = async (data: any) =>
  requestWithAuthorized('workflows', {
    method: 'POST',
    data,
  }).then((data) => data)

export const editWorkflow = async (id: number, data: any) =>
  requestWithAuthorized(`workflows/${id}`, {
    method: 'PUT',
    data,
  }).then((data) => data)

export const deleteWorkflow = async (id: number) =>
  requestWithAuthorized(`workflows/${id}`, {
    method: 'DELETE',
  }).then((data) => data)

export const addStage = async (data: any, query?: any) =>
  requestWithAuthorized('stages?' + new URLSearchParams(query), {
    method: 'POST',
    data,
  }).then((data) => data)

export const editStage = async (id: number, data: any, query?: any) =>
  requestWithAuthorized(`stages/${id}?` + new URLSearchParams(query), {
    method: 'PUT',
    data,
  }).then((data) => data)

export const addWorkflowCategory = async (data: any) =>
  requestWithAuthorized('workflow-categories', {
    method: 'POST',
    data,
  }).then((data) => data)

export const updateWorkflowCategory = async (id: number, data: any) =>
  requestWithAuthorized(`workflow-categories/${id}`, {
    method: 'PUT',
    data,
  }).then((data) => data)

export const deleteWorkflowCategoryById = async (id: number) =>
  requestWithAuthorized(`workflow-categories/${id}`, {
    method: 'DELETE',
  }).then((data) => data)

export const deleteStageById = async (id: number) =>
  requestWithAuthorized(`stages/${id}`, {
    method: 'DELETE',
  }).then((data) => data)

export const getAccounts = async (query?: any) => {
  return requestWithAuthorized('accounts?' + new URLSearchParams(query))
    .then((data) => data)
    .catch(() => [])
}

export const getAccountsAsAttendance = async (query?: any) => {
  return requestWithAuthorized(
    'attendance-accounts?' + new URLSearchParams(query),
  )
    .then((data) => data)
    .catch(() => [])
}

export const addAccount = async (data: any) =>
  requestWithAuthorized('register', {
    method: 'POST',
    data,
  }).then((data) => data)

export const editAccount = async (id: number, data: any, body?: FormData) =>
  requestWithAuthorized(`accounts/${id}`, {
    method: 'PUT',
    data,
    body,
  }).then((data) => data)

export const deleteAccount = async (id: number) =>
  requestWithAuthorized(`accounts/${id}`, {
    method: 'DELETE',
  }).then((data) => data)

export const getTasksByStageId = async (id: number) =>
  requestWithAuthorized(`tasks/${id}/stage`)
    .then((data) => data)
    .catch(() => [])

export const addTask = async (data: any) =>
  requestWithAuthorized('tasks', {
    method: 'POST',
    data,
  }).then((data) => data)

export const editTask = async (id: number, data: any) => {
  return await requestWithAuthorized(`tasks/${id}`, {
    method: 'PUT',
    data,
  }).then((data) => data)
}

export const assignTaskWithoutWork = async (id: number, data: any) => {
  return await requestWithAuthorized(`assign-work/${id}`, {
    method: 'PUT',
    data,
  }).then((data) => data)
}

export const moveStage = async (id: number, stageId: number, data?: any) => {
  return await requestWithAuthorized(`tasks/${id}?stage_id=${stageId}`, {
    method: 'PUT',
    data,
  }).then((data) => data)
}

export const getTaskById = async (id: number, options?: RequestOptions) =>
  requestWithAuthorized(`tasks/${id}`, { ...options })
    .then((data) => data)
    .catch(() => null)

export const deleteTask = async (id: number) =>
  requestWithAuthorized(`tasks/${id}`, {
    method: 'DELETE',
  }).then((data) => data)

export const addTaskFields = async (data: any) =>
  requestWithAuthorized('fields', {
    method: 'POST',
    data,
  }).then((data) => data)

export const getCustomFieldsByWorkflowId = async (
  query?: any,
  options?: RequestOptions,
) => {
  return requestWithAuthorized(`fields?` + new URLSearchParams(query), {
    ...options,
  })
    .then((data) => data)
    .catch(() => [])
}

export const deleteCustomFieldById = async (id: number) =>
  requestWithAuthorized(`fields/${id}`, {
    method: 'DELETE',
  }).then((data) => data)

export const editCustomField = async (id: number, data: any) =>
  requestWithAuthorized(`fields/${id}`, {
    method: 'PUT',
    data,
  }).then((data) => data)

export const getTaskFieldsByTaskId = async (query?: any) => {
  return requestWithAuthorized(`field-values?` + new URLSearchParams(query))
    .then((data) => data)
    .catch(() => [])
}

export const editTaskField = async (id: number, data?: any) =>
  requestWithAuthorized(`task-fields/${id}`, {
    method: 'PUT',
    data,
  }).then((data) => data)

export const uploadImage = async (data: any) => {
  return await requestWithFile('images', {
    method: 'POST',
    body: data,
  })
}

export const getTaskHistories = async (query?: any, options?: RequestOptions) =>
  requestWithAuthorized('history-move-tasks?' + new URLSearchParams(query), {
    ...options,
  })
    .then((data) => data)
    .catch(() => [])

export const getTimeStagesByTaskId = async (id: number) =>
  requestWithAuthorized(`time-stage/${id}`)
    .then((data) => data)
    .catch(() => [])

export const getReportFieldsByWorkflowId = async (
  query?: any,
  options?: RequestOptions,
) =>
  requestWithAuthorized(`report-fields?` + new URLSearchParams(query), {
    ...options,
  })
    .then((data) => data)
    .catch(() => [])

export const addReportField = async (data: any) =>
  requestWithAuthorized('report-fields', {
    method: 'POST',
    data,
  }).then((data) => data)

export const updateReportField = async (id: number, data: any) =>
  requestWithAuthorized(`report-fields/${id}`, {
    method: 'PUT',
    data,
  }).then((data) => data)

export const deleteReportField = async (id: number) =>
  requestWithAuthorized(`report-fields/${id}`, {
    method: 'DELETE',
  }).then((data) => data)

export const addTaskReport = async (data: any, query?: any) =>
  requestWithAuthorized(`report-field-values?` + new URLSearchParams(query), {
    method: 'POST',
    data,
  }).then((data) => data)

export const updateTaskReports = async (id: number, data: any) =>
  requestWithAuthorized(`report-field-values/${id}`, {
    method: 'PUT',
    data,
  }).then((data) => data)

export const getTaskReports = async (query?: any) =>
  requestWithAuthorized(`report-field-values?` + new URLSearchParams(query))
    .then((data) => data)
    .catch(() => [])

export const getTaskReportsByTaskId = async (taskId: number) =>
  requestWithAuthorized(`report-field-values/${taskId}`)
    .then((data) => data)
    .catch(() => [])

export const getMe = async (query?: any, options?: RequestOptions) =>
  requestWithAuthorized(`my-account?` + new URLSearchParams(query), {
    ...options,
  })
    .then((data) => data)
    .catch(() => [])

export const getNotifications = async (query?: any) =>
  requestWithAuthorized('notifications?' + new URLSearchParams(query))
    .then((data) => data)
    .catch(() => [])

export const updateNotification = async (id: number, data: any) =>
  requestWithAuthorized(`notifications/${id}`, {
    method: 'PUT',
    data,
  }).then((data) => data)

export const deleteNotification = async (id: number, query?: any) =>
  requestWithAuthorized(`notifications/${id}?` + new URLSearchParams(query), {
    method: 'DELETE',
  }).then((data) => data)

export const getAttendances = async (query?: any) =>
  requestWithAuthorized('attendances?' + new URLSearchParams(query))
    .then((data) => data)
    .catch(() => null)

export const getCommentsByTaskId = async (query?: any) =>
  requestWithAuthorized(`comments?` + new URLSearchParams(query))
    .then((data) => data)
    .catch(() => [])

export const addComment = async (data: any) =>
  requestWithAuthorized('comments', {
    method: 'POST',
    data,
  }).then((data) => data)

export const deleteComment = async (id: number) =>
  requestWithAuthorized(`comments/${id}`, {
    method: 'DELETE',
  }).then((data) => data)

export const checkIn = async (query?: any) =>
  requestWithAuthorized('check-in?' + new URLSearchParams(query), {
    method: 'POST',
  }).then(async (data) => {
    const session = await getSession()
    session.isCheckedIn = true

    await session.save()
    return data
  })

export const checkOut = async () =>
  requestWithAuthorized('check-out', {
    method: 'POST',
  }).then(async (data) => {
    const { success, error } = data

    const session = await getSession()
    session.isCheckedIn = false

    if (error) {
      return { error }
    }

    await session.save()
    return { success }
  })

export const refreshData = async (query?: any) =>
  requestWithAuthorized('load-youtube?' + new URLSearchParams(query), {
    method: 'PUT',
  }).then((data) => data)

export const getKpi = async (query?: any) =>
  requestWithAuthorized('kpis?' + new URLSearchParams(query)).then(
    (data) => data,
  )

export const getIpAddress = async () => {
  return await request('https://api.ipify.org?format=json')
    .then((data) => data)
    .catch(() => null)
}

export const getBankList = async () => {
  return await request('https://api.vietqr.io/v2/banks')
    .then((data) => data)
    .catch(() => [])
}

export const uploadFiles = async (data: FormData) => {
  return await requestWithFile('upload-files', {
    method: 'POST',
    body: data,
  }).catch(() => null)
}
