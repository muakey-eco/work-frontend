'use server'

import { editTask, getMe } from '@/libs/data'
import {
  addTag,
  addTagToTask,
  deleteTag,
  getTags,
  updateTagById,
} from '@/libs/tag'
import {
  moveNextStage,
  movePreviousStage,
  movetoFirstStage,
} from '@/libs/workflow'

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

export const moveNextStageAction = async (id: number, data: any) =>
  moveNextStage(id, data)

export const movePreviousStageAction = async (id: number, data: any) =>
  movePreviousStage(id, data)

export const movetoFirstStageAction = async (id: number, data: any) =>
  movetoFirstStage(id, data)
