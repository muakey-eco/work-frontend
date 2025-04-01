'use server'

import { getAssetById } from '@/libs/asset'

export const getAssetByIdAction = async (id: number) => {
  return await getAssetById(id)
}
    