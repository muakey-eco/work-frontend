'use server'

import {
  deleteResource,
  deleteResourceCategory,
  getResourceCategoriesByName,
} from '@/libs/resources'

export const deleteResourceCategoryAction = async (rId: number) => {
  return await deleteResourceCategory(rId)
}

export const deleteResourceAction = async (rId: number) => {
  return await deleteResource(rId)
}

export const getResourceCategories = async (name: string) => {
  return await getResourceCategoriesByName(name)
}
