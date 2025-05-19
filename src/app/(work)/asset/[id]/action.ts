'use server'

import { deleteAsset, getAssetById } from '@/libs/asset'

export const getAssetByIdAction = async (id: number) => {
  return await getAssetById(id)
}

export const deleteAssetAction = async (id: number) => {
  return await deleteAsset(id)
}
