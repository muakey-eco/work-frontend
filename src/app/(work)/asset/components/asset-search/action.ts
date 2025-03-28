'use server'

import { getAssets, searchAsset } from '@/libs/asset'

export const searchAssetAction = async (query: string) => {
  return await searchAsset(query)
}

export const getAssetsAction = async () => {
  return await getAssets()
}
