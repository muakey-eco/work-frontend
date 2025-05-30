'use server'

import { loginWidthCredentials } from '@/libs/auth'

export const loginWidthCredentialsAction = async (data: any) => {
  const { errors } = await loginWidthCredentials(data)

  return { errors }
}
