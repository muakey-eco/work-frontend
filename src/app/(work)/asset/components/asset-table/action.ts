'use server'

import { getAssetCount, getAssetsByPagnition } from '@/libs/asset'

export async function getAssetsByPagnitionAction(query: string) {
  return await getAssetsByPagnition(query)
}
export async function getAssetCountAction() {
  return await getAssetCount()
}
