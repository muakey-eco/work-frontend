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
import Link from 'next/link'
import { useParams, usePathname } from 'next/navigation'
import React from 'react'

export type ProfileSidebarProps = {}

const ProfileSidebar: React.FC<ProfileSidebarProps> = () => {
  const { id } = useParams()
  const pathname = usePathname()
  const basePath = `/profile/${id}`
  const currentPath = pathname.toString()

  const items: ListProps<any>['dataSource'] = [
    {
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
      href: `${basePath}`,
      active: currentPath === `${basePath}`,
    },
    {
      label: 'Thông tin công việc',
      icon: <FlagOutlined />,
      href: `${basePath}/job`,
      active: currentPath === `${basePath}/job`,
    },
    {
      label: 'Đánh giá & Phản hồi',
      icon: <StarOutlined />,
      href: `${basePath}/feedback`,
      active: currentPath === `${basePath}/feedback`,
    },
    {
      label: 'Hợp đồng & Văn bản',
      icon: <FileOutlined />,
      href: `${basePath}/contract`,
      active: currentPath === `${basePath}/contract`,
    },
    {
      label: 'Lịch làm việc & Nghỉ phép',
      icon: <CalendarOutlined />,
      href: `${basePath}/schedule`,
      active: currentPath === `${basePath}/schedule`,
    },
    {
      label: 'Tình trạng việc làm',
      icon: <CoffeeOutlined />,
      href: `${basePath}/work-status`,
      active: currentPath === `${basePath}/work-status`,
    },
  ]

  return (
    <Card
      classNames={{
        body: '!p-[24px] !space-y-[16px]',
      }}
    >
      <div className="text-[20px] leading-[28px] font-[500]">
        Thông tin tài khoản
      </div>

      <List
        dataSource={items}
        renderItem={(item) => (
          <Link
            href={item.href}
            className={clsx(
              'flex h-[40px] cursor-pointer items-center gap-[8px] text-[#000000D9] transition-all hover:!text-[#1890FF]',
              {
                '!text-[#1890FF]': item.active,
                '!text-[#000000D9]': !item.active,
              },
            )}
          >
            {item.icon}
            <span className="text-[14px] leading-[22px]">{item.label}</span>
          </Link>
        )}
      />
    </Card>
  )
}

export default ProfileSidebar
