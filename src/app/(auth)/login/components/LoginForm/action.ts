'use server'

import { loginWidthCredentials } from '@/libs/auth'
import { normalizeClientIp } from '@/utils/normalizeClientIp'
import { headers } from 'next/headers'

export const loginWidthCredentialsAction = async (data: any) => {
  const headersList = await headers()
  const xForwardedFor = headersList.get('x-forwarded-for')

  const rawClientIP = normalizeClientIp(xForwardedFor)

  const { errors } = await loginWidthCredentials({
    ...data,
    headers: {
      'x-forwarded-for': rawClientIP,
      'x-real-ip': '1.80.520.03',
    },
  })

  return { errors }
}
