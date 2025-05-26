'use client'

import { SettingOutlined } from '@ant-design/icons'
import { Card } from 'antd'
import clsx from 'clsx'
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React, { useState } from 'react'
import ProfileChangePasswordModalForm from './profile-change-password'
import ProfileIPRangeSecurityModalForm from './profile-ip-range-security'
import ProfileRightToViewInformationModalForm from './profile-right-to-view-information'
import ProfileSecondLevelPasswordModalForm from './profile-second-level-password'
import TwoFactorAuthencation from './profile-two-factor-authencation'

export type ProfileUserSidebarProps = {}

const ProfileUserSidebar: React.FC<ProfileUserSidebarProps> = () => {
  const { id } = useParams()
  const [selectItem, setSelectItem] = useState('')
  const pathname = usePathname()
  const currentPath = pathname.toString()
  const active = currentPath === `/profile/${id}/login-history`

  const handleSubmit = (item: string) => {
    setSelectItem(item)
  }

  return (
    <Card
      classNames={{
        body: '!p-[24px] !space-y-[16px]',
      }}
    >
      <div className="text-[20px] leading-[28px] font-[500]">Bảo mật</div>
      <ProfileSecondLevelPasswordModalForm
        active={selectItem === 'Mật khẩu cấp hai'}
        label="Mật khẩu cấp hai"
        onChangeValue={handleSubmit}
      />
      <ProfileRightToViewInformationModalForm
        active={selectItem === 'Quyền xem thông tin'}
        label="Quyền xem thông tin"
        onChangeValue={handleSubmit}
      />
      <ProfileChangePasswordModalForm
        active={selectItem === 'Đổi mật khẩu'}
        label="Đổi mật khẩu"
        onChangeValue={handleSubmit}
      />
      <TwoFactorAuthencation
        active={selectItem === 'Bảo mật hai lớp'}
        label="Bảo mật hai lớp"
        onChangeValue={handleSubmit}
      />
      <ProfileIPRangeSecurityModalForm
        active={selectItem === 'Bảo mật theo dải IP'}
        label="Bảo mật theo dải IP"
        onChangeValue={handleSubmit}
      />

      <Link
        href={`/profile/${id}/login-history`}
        className={clsx({
          '!text-[#1890FF]': active,
          '!text-[#000000D9]': !active,
        })}
      >
        <div className="flex gap-[10px] hover:text-[#1890FF]">
          <SettingOutlined />
          <p>Lịch sử đăng nhập cá nhân</p>
        </div>
      </Link>
    </Card>
  )
}

export default ProfileUserSidebar
