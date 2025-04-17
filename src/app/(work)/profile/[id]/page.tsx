import { getMe } from '@/libs/data'
import { notFound } from 'next/navigation'
import ProfileContactCard from '../components/profile-contact-card'
import ProfileDeductionsCard from '../components/profile-deductions-card'
import ProfileEduInfomationCard from '../components/profile-edu-infomation-card'
import ProfileInfomationCard from '../components/profile-infomation-card'
import ProfileWorkHistoryCard from '../components/profile-work-history-card'
import ProfileMoreLayout from '../components/ProfileLayout'
import { getAccountByIdAction } from './(more)/action'

export default async function ProfilePage({
  params,
}: {
  params: { id: string }
}) {
  const { id } = params
  console.log('idParams', params)
  let user = await getMe({
    include: 'profile',
  })

  if (!id) {
  } else if (id && user.role === 'Quản trị cấp cao') {
    user = await getAccountByIdAction(Number(id), {
      include: 'profile',
    })
  } else {
    notFound()
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
