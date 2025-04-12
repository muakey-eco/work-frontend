import { getMe } from '@/libs/data'
import { notFound } from 'next/navigation'
import { getAccountByIdAction } from '../(more)/action'

export default async function getUserByIdParams(searchParams: any) {
  const { id } = await searchParams

  let user = await getMe({
    include: 'profile',
  })

  if (!id) {
    return user
  } else if (id && user.role === 'Quản trị cấp cao') {
    user = await getAccountByIdAction(id, {
      include: 'profile',
    })
  } else {
    notFound()
  }

  return user
}
