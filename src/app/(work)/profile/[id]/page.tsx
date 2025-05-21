import { getMe } from '@/libs/data'
import Link from 'next/link'
import ProfileContactCard from '../components/profile-contact-card'
import ProfileDeductionsCard from '../components/profile-deductions-card'
import ProfileEduInfomationCard from '../components/profile-edu-infomation-card'
import ProfileInfomationCard from '../components/profile-infomation-card'
import ProfileWorkHistoryCard from '../components/profile-work-history-card'
import ProfileMoreLayout from '../components/ProfileLayout'
import { getAccountByIdAction } from './(more)/action'

type Props = {
  params: Promise<{ id: string }>
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function ProfilePage({ params }: Props) {
  const resolvedParams = await params
  const { id } = resolvedParams

  let user = await getMe({ include: 'profile' })

  if (user.role === 'Admin') {
    if (id) {
      user = await getAccountByIdAction(Number(id), {
        include: 'profile',
      })
    }
  } else if (user.id !== Number(id)) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
        <div className="text-2xl">Không có mùa xuân đấy đâu 👉👈</div>
        <Link href={`/profile/${user.id}`}>
          <button className="!cursor-pointer rounded-lg bg-[#1677FF] px-4 py-2 text-white transition hover:bg-[#4096ff]">
            Về nào
          </button>
        </Link>
      </div>
    )
  }

  return (
    <ProfileMoreLayout user={user}>
      <div className="no-scroll h-[calc(100vh-87px)] !space-y-[16px] overflow-y-auto">
        <ProfileInfomationCard title="Thông tin cá nhân" user={user} />

        <ProfileDeductionsCard title="Thuế và bảo hiểm" user={user} />

        <ProfileEduInfomationCard
          title="Thông tin học vấn"
          items={user?.educations}
          options={{
            userId: user?.id,
          }}
        />

        <ProfileWorkHistoryCard
          title="Lịch sử làm việc"
          items={user?.work_histories}
          options={{
            userId: user?.id,
          }}
        />

        <ProfileContactCard
          title="Gia đình, người phụ thuộc và người liên hệ khác"
          items={user?.family_members}
          options={{
            userId: user?.id,
          }}
        />
      </div>
    </ProfileMoreLayout>
  )
}
