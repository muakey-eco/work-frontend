'use server'

import { checkPassword } from '@/libs/data'
import { cookies } from 'next/headers'

export const checkPasswordAction = async (data: any) => {
  const res = await checkPassword(data)
  if (res.message === 'Mật khẩu chính xác') {
    const cookieStore = await cookies()
    cookieStore.set('can_view_payroll', 'true', {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60,
    })
  }
  return res
}
