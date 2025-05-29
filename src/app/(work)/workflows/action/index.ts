'use server'

import {
  addReportField,
  addStage,
  addTask,
  addTaskFields,
  addWorkflow,
  addWorkflowCategory,
  assignTaskWithoutWork,
  deleteCustomFieldById,
  deleteReportField,
  deleteStageById,
  deleteTask,
  deleteWorkflow,
  deleteWorkflowCategoryById,
  editCustomField,
  editStage,
  editTask,
  editWorkflow,
  getAccounts,
  getWorkflowCategories,
  getWorkflowMembers,
  getWorkflows,
  moveStage,
  updateReportField,
  updateWorkflowCategory,
} from '@/libs/data'

export const addStageAction = async (data: any, query?: any) =>
  addStage(data, query)

export const editStageAction = async (id: number, data: any, query?: any) =>
  editStage(id, data, query)

export const deleteStageByIdAction = async (id: number) => deleteStageById(id)

export const getWorkflowsAction = async (query?: any) => {
  return await getWorkflows(query)
    .then((data) => data)
    .catch(() => [])
}

export const addWorkflowCategoryAction = async (data: any) =>
  addWorkflowCategory(data)

export const updateWorkflowCategoryAction = async (id: number, data: any) =>
  updateWorkflowCategory(id, data)

export const getAccountsAction = async (query?: any) => {
  return await getAccounts(query)
    .then((data) => data)
    .catch(() => [])
}

export const addWorkflowAction = async (data: any) => addWorkflow(data)

export const editWorkflowAction = async (id: number, data: any) =>
  editWorkflow(id, data)

export const deleteWorkflowAction = async (id: number) => deleteWorkflow(id)

export const deleteWorkflowCategoryByIdAction = async (id: number) =>
  deleteWorkflowCategoryById(id)

export const getWorkflowCategoriesAction = async () => {
  return await getWorkflowCategories()
    .then((data) => data)
    .catch(() => [])
}

// export const getTasksByStageIdAction = async (id: number) => {
//   return await getTasksByStageId(id)
//     .then((data) => data)
//     .catch(() => [])
// }

export const getWorkflowMembersAction = async (id: number) => {
  return await getWorkflowMembers(id)
    .then((data) => data)
    .catch(() => [])
}

export const addTaskAction = async (data: any) => addTask(data)

export const editTaskAction = async (id: number, data: any) =>
  editTask(id, data)

export const assignTaskWithoutWorkAction = async (id: number, data: any) => {
  return await assignTaskWithoutWork(id, data)
}

export const moveStageAction = async (id: number, stageId: number) =>
  moveStage(id, stageId)

export const deleteTaskAction = async (id: number) => deleteTask(id)

export const addTaskFieldsAction = async (data: any) => addTaskFields(data)

export const deleteCustomFieldByIdAction = async (id: number) =>
  deleteCustomFieldById(id)

export const editCustomFieldAction = async (id: number, data: any) =>
  editCustomField(id, data)

export const addReportFieldAction = async (data: any) => addReportField(data)

export const updateReportFieldAction = async (id: number, data: any) =>
  updateReportField(id, data)

export const deleteReportFieldAction = async (id: number) =>
  deleteReportField(id)
