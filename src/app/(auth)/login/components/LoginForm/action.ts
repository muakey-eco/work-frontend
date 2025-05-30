'use server'

import { loginWidthCredentials } from '@/libs/auth'
import { headers } from 'next/headers'

export const loginWidthCredentialsAction = async (data: any) => {
  const headersList = await headers()
  const xForwardedFor = headersList.get('x-forwarded-for')
  const xRealIp = headersList.get('x-real-ip')

  const rawClientIP =
    xForwardedFor?.split(',')[0] !== '::1'
      ? xForwardedFor?.split(',')[0]
      : '1.54.23.141'

  const { errors } = await loginWidthCredentials({
    ...data,
    headers: {
      'x-forwarded-for': rawClientIP,
      'x-real-ip': xRealIp || '1.80.520.03',
    },
  })

  return { errors }
}
