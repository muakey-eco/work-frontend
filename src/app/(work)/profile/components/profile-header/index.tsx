'use client'

import { PageHeader } from '@/components'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { usePathname } from 'next/navigation'

const ProfileHeader = () => {
  const pathname = usePathname()

  return (
    <PageHeader
      title={
        <div className="flex items-center gap-[8px]">
          <ArrowLeftOutlined className="cursor-pointer" />
          <span>
            {pathname === '/profile/login-history'
              ? 'Lịch sử đăng nhập cá nhân'
              : 'Tài khoản của tôi'}
          </span>
        </div>
      }
    />
  )
}

export default ProfileHeader
