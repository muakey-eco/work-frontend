'use client'

import { Card } from 'antd'
import React, { useState } from 'react'
import Link from 'next/link'
import { SettingOutlined } from '@ant-design/icons'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import ProfileSecondLevelPasswordModalForm from './profile-second-level-password'
import ProfileRightToViewInformationModalForm from './profile-right-to-view-information'
import ProfileChangePasswordModalForm from './profile-change-password'
import TwoFactorAuthencation from './profile-two-factor-authencation'
import ProfileIPRangeSecurityModalForm from './profile-ip-range-security'

export type ProfileUserSidebarProps = {}

const ProfileUserSidebar: React.FC<ProfileUserSidebarProps> = () => {
  const [selectItem, setSelectItem] = useState("");
  const pathname = usePathname()
  const currentPath = pathname.toString()
  const active = currentPath === "/profile/login-history";

  const handleSubmit = (item: string) => {
    setSelectItem(item);
  }

  return (
    <Card
      classNames={{
        body: '!p-[24px] !space-y-[16px]',
      }}
    >
      <div className="text-[20px] leading-[28px] font-[500]">Bảo mật</div>
      <ProfileSecondLevelPasswordModalForm
        active={selectItem === "Mật khẩu cấp hai"}
        label='Mật khẩu cấp hai'
        onChangeValue={handleSubmit}
      />
      <ProfileRightToViewInformationModalForm
        active={selectItem === "Quyền xem thông tin"}
        label='Quyền xem thông tin'
        onChangeValue={handleSubmit}
      />
      <ProfileChangePasswordModalForm
        active={selectItem === "Đổi mật khẩu"}
        label='Đổi mật khẩu'
        onChangeValue={handleSubmit}
      />
      <TwoFactorAuthencation
        active={selectItem === "Bảo mật hai lớp"}
        label='Bảo mật hai lớp'
        onChangeValue={handleSubmit}
      />
      <ProfileIPRangeSecurityModalForm
        active={selectItem === "Bảo mật theo dải IP"}
        label='Bảo mật theo dải IP'
        onChangeValue={handleSubmit} />

      <Link
        href={"/profile/login-history"}
        className={clsx(
          {
            '!text-[#1890FF]': active,
            '!text-[#000000D9]': !active,
          }
        )}
      >
        <div className='flex hover:text-[#1890FF] gap-[10px]'>
          <SettingOutlined />
          <p>Lịch sử đăng nhập cá nhân</p>
        </div>
      </Link>

    </Card>
  )
}

export default ProfileUserSidebar
