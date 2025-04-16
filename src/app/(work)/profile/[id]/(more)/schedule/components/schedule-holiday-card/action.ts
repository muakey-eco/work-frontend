'use server'

import { updateAccountProfile } from '@/libs/schedule'

export const updateAccountProfileAction = async (id: string, data: any) => {
  return await updateAccountProfile(id, data)
}