'use server'

import { editTask, editTaskField, uploadImage } from "@/libs/data"

export const editTaskFieldAction = async (id: number, data?: any) => 
  editTaskField(id, data)

export const uploadImageAction = async (data: any) => 
  uploadImage(data)
  .then(({ error, urlImage }) => ({ error, url: urlImage }))

export const editTaskAction = async (id: number, data?: any) => 
  editTask(id, data)
  .then(({ error, message }) => ({ error, message }))
  .catch((error) => ({ error }))