'use server'

import {
  addAssetCategory,
  deleteAssetCategory,
  getAssetCategories,
  updateAssetCategory,
} from '@/libs/asset'
import { changeLoggedInDate, logout } from '@/libs/auth'
import {
  addAccount,
  addTask,
  assignTaskWithoutWork,
  checkIn,
  checkOut,
  editAccount,
  editTask,
  getAccounts,
  getAccountsWithoutQuitWork,
  getMe,
  getTaskHistories,
  uploadImage,
} from '@/libs/data'
import { getNotifications } from '@/libs/notifications'
import {
  addPropose,
  addProposeCategory,
  deletePropose,
  deleteProposeCategory,
  updatePropose,
  updateProposeCategory,
} from '@/libs/propose'
import {
  createResource,
  createResourceCategory,
  getResourceCategories,
  updateResource,
  updateResourceCategory,
} from '@/libs/resources'
import { getRoles } from '@/libs/role'
import {
  addTag,
  addTagToTask,
  deleteTag,
  getTags,
  updateTagById,
} from '@/libs/tag'
import { getTodos } from '@/libs/todos'

export const logoutAction = async () => {
  return await logout()
}

export const checkedInAction = async (query?: any) => checkIn(query)

export const checkOutAction = async () => checkOut()

export const changeLoggedInDateAction = async () => changeLoggedInDate()

export const getTaskHistoriesAction = async (query?: any) =>
  getTaskHistories(query)

export const uploadImageAction = async (file: any) => {
  return await uploadImage(file)
}

export const addProposeCategoryAction = async (data: any) => {
  return await addProposeCategory(data)
}

export const updateProposeCategoryAction = async (id: number, data: any) => {
  return await updateProposeCategory(id, data)
}

export const deleteProposeCategoryAction = async (id: number) => {
  return await deleteProposeCategory(id)
}

export const addProposeAction = async (data: any) => {
  return await addPropose(data)
}

export const updateProposeAction = async (id: number, data: any) => {
  return await updatePropose(id, data)
}

export const deleteProposeAction = async (id: number) => {
  return await deletePropose(id)
}

export const addTagAction = async (data: any) => {
  return await addTag(data)
}

export const getTagsAction = async (query?: any) => {
  return await getTags(query)
}

export const deleteTagAction = async (id: number) => {
  return await deleteTag(id)
}

export const addTagToTaskAction = async (data: any) => {
  return await addTagToTask(data)
}

export const updateTagAction = async (id: number, data: any) => {
  return await updateTagById(id, data)
}

export const getMeAction = async () => {
  return await getMe()
}

export const editTaskAction = async (id: number, data: any) =>
  editTask(id, data)

export const addTaskAction = async (data: any) => addTask(data)

export const assignTaskWithoutWorkAction = async (id: number, data: any) => {
  return await assignTaskWithoutWork(id, data)
}

export const createResourceCategoryAction = async (data: any) => {
  return await createResourceCategory(data)
}

export const updateResourceCategoryAction = async (id: number, data: any) => {
  return await updateResourceCategory(id, data)
}

export const createResourceAction = async (data: any) => {
  return await createResource(data)
}

export const updateResourceAction = async (id: number, data: any) => {
  return await updateResource(id, data)
}

export const getAccountsReuqest = async (query?: any) => {
  return await getAccounts(query)
}

export const getResourceCategoriesRequest = async () => {
  return await getResourceCategories()
}

export const getRolesRequest = async () => {
  return await getRoles()
}

export const addAccountAction = async (account: any) => {
  return await addAccount(account)
}

export const editAccountAction = async (id: number, account: any) => {
  return await editAccount(id, account)
}
export const addAssetCategoryAction = async (data: any) => {
  return await addAssetCategory(data)
}

export const getAssetCategoriesAction = async () => {
  return await getAssetCategories()
}

export const deleteAssetCategoryAction = async (id: number) => {
  return await deleteAssetCategory(id)
}

export const updateAssetCategoryAction = async (id: number, data: any) => {
  return await updateAssetCategory(id, data)
}
export const getTodosAction = async (query?: any) => {
  return await getTodos(query)
}

export const getNotificationsAction = async () => {
  return await getNotifications()
}
export const getAccountsWithoutQuitWorkAction = async () => {
  return await getAccountsWithoutQuitWork()
}
