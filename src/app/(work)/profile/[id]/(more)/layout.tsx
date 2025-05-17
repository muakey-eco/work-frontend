import { getUserById } from '@/libs/data'
import React from 'react'
import ProfileLayout from '../../components/ProfileLayout'

type Props = {
  children: React.ReactNode
  params: Promise<{ id: string }>
}

const ProfileMoreLayout = async ({ children, params }: Props) => {
  const resolvedParams = await params
  const user = await getUserById(Number(resolvedParams.id), {
    include: 'profile',
  })

  return <ProfileLayout user={user}>{children}</ProfileLayout>
}

export default ProfileMoreLayout
