'use server'

import { addAsset, updateAsset } from '@/libs/asset'

export async function addAssetAction(formData: any) {
  try {
    const response = await addAsset(formData)
    return { success: true, data: response }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Có lỗi xảy ra khi thêm tài sản',
    }
  }
}

export async function updateAssetAction(id: number, formData: any) {
  try {
    const response = await updateAsset(id, formData)
    return { success: true, data: response }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Có lỗi xảy ra khi sửa tài sản',
    }
  }
}
