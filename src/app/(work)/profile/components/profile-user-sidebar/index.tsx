'use client'

import {
  CalendarOutlined,
  CoffeeOutlined,
  FileOutlined,
  FlagOutlined,
  StarOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Card, List, ListProps } from 'antd'
import clsx from 'clsx'
import React, { useState } from 'react'
import ProfileRightToViewInformation from './profile-right-to-view-information'
import ProfileIPRangeSecurity from './profile-ip-range-security'
import ProfileChangePassword from './profile-change-password'
import ProfileSecondLevelPassword from './profile-second-level-password'

export type ProfileUserSidebarProps = {}

const ProfileUserSidebar: React.FC<ProfileUserSidebarProps> = () => {
  const [selectItem, setSelectItem] = useState("");

  const items: ListProps<any>['dataSource'] = [
    {
      label: 'Mật khẩu cấp 2',
      icon: <UserOutlined />,
      href: '',
      active: selectItem === 'Mật khẩu cấp 2',
    },
    {
      label: 'Quyền xem thông tin',
      icon: <FlagOutlined />,
      href: '',
      active: selectItem === 'Quyền xem thông tin',
    },
    {
      label: 'Đổi mật khẩu',
      icon: <StarOutlined />,
      href: '',
      active: selectItem === 'Đổi mật khẩu',
    },
    {
      label: 'Bảo mật hai lớp',
      icon: <FileOutlined />,
      href: '',
      active: selectItem === 'Bảo mật hai lớp',
    },
    {
      label: 'Bảo mật theo dải IP',
      icon: <CalendarOutlined />,
      href: '',
      active: selectItem === 'Bảo mật theo dải IP',
    },
    {
      label: 'Lịch sử đăng nhập cá nhân',
      icon: <CoffeeOutlined />,
      href: '',
      active: selectItem === 'Lịch sử đăng nhập cá nhân',
    },
  ]

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
      <ProfileSecondLevelPassword />
      <ProfileRightToViewInformation />
      <ProfileChangePassword />
      <ProfileIPRangeSecurity />
    </Card>
  )
}

export default ProfileUserSidebar
