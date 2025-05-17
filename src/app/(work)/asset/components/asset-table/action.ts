'use server'

import { getAssetsByPagnition } from '@/libs/asset'

export async function getAssetsByPagnitionAction(query: string) {
  return await getAssetsByPagnition(query)
}
