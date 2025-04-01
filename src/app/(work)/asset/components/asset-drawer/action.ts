'use server'

import { filterAssets } from '@/libs/asset'

export async function filterAssetsAction(formData: any) {
  const response = await filterAssets(formData)
  return { success: true, data: response }
}
