import { getUserById } from '@/libs/data'
import React from 'react'
import ProfileLayout from '../../components/ProfileLayout'

const ProfileMoreLayout: React.FC<
  Readonly<{
    children: React.ReactNode
    params: { id: string }
  }>
> = async ({ children, params }) => {
  const user = await getUserById(Number(params.id), {
    include: 'profile',
  })

  return <ProfileLayout user={user}>{children}</ProfileLayout>
}

export default ProfileMoreLayout
