'use client'

import { PageHeader } from '@/components'
import { usePathname } from 'next/navigation'

const ProfileHeader = ({ account }: { account: any }) => {
  const pathname = usePathname()

  return (
    <PageHeader
      onBack={account.role === 'Admin'}
      title={
        <div className="flex items-center gap-[8px]">
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
