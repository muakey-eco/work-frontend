'use server'

import { addAsset, getAssetCategories, getAssets, getBrand } from '@/libs/asset'
import { getAccountsAsAttendance } from '@/libs/data'

export const addAssetAction = async (values: any) => {
  return await addAsset(values)
}

export const getAccountsAsAttendanceAction = async () => {
  return await getAccountsAsAttendance()
}

export const getBrandAction = async () => {
  return await getBrand()
}

export const getAssetCategoriesAction = async () => {
  return await getAssetCategories()
}

