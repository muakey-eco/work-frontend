'use client'

import { formatCurrency } from '@/lib/utils'
import { randomColor } from '@/libs/utils'
import { HeartFilled, MailOutlined, PhoneOutlined } from '@ant-design/icons'

import { Avatar, Badge, Card, Progress } from 'antd'
import React, { useMemo } from 'react'
import animation from './lotties/gold-coin-animation.json'

import dynamic from 'next/dynamic'
import useSeniority from '../../hooks/useSeniority'

const LottiePlayer = dynamic(
  () => import('@lottiefiles/react-lottie-player').then((mod) => mod.Player),
  {
    ssr: false, // Vô hiệu hóa SSR chỉ cho Lottie Player
  },
)

export type ProfileOverviewProps = {
  user?: any
}

const ProfileOverview: React.FC<ProfileOverviewProps> = ({ user }) => {
  const { basic_salary, travel_allowance, kpi, eat_allowance } =
    user?.salary || {}

  const totalSalary = useMemo(() => {
    return basic_salary + travel_allowance + kpi + eat_allowance
  }, [basic_salary, travel_allowance, kpi, eat_allowance])

  const seniority = useSeniority(user?.start_work_date)

  const items = [
    {
      icon: <HeartFilled className="!text-[#F5222D]" />,
      label: seniority,
    },
    {
      icon: <MailOutlined />,
      label: user?.email || '--',
    },
    {
      icon: <PhoneOutlined />,
      label: user?.phone || '--',
    },
    {
      icon: (
        <LottiePlayer
          src={animation}
          loop
          autoplay
          style={{ height: 16, width: 16, transform: 'scale(2.6)' }}
        />
      ),
      label: user?.salary ? `${formatCurrency(totalSalary)}đ` : '--',
    },
  ]

  return (
    <Card
      classNames={{
        body: '!p-[24px] !space-y-[16px]',
      }}
    >
      <div className="flex justify-center">
        <Avatar
          className="rounded-full! text-[16px]!"
          size={98}
          shape="circle"
          src={user?.avatar}
          style={{
            backgroundColor: randomColor(String(user?.full_name)),
            fontSize: 30,
          }}
          alt={user?.full_name}
        >
          <p className="text-3xl">
            {String(user?.full_name).charAt(0).toLocaleUpperCase()}
          </p>
        </Avatar>{' '}
      </div>

      <div className="text-center">
        <div className="text-[20px] leading-[28px] font-[500]">
          {user?.full_name || ''}
        </div>
        <div className="text-[14px] leading-[22px] font-[400] text-[#00000073]">
          {user?.role}
        </div>
      </div>

      <div className="flex items-center justify-center gap-[8px]">
        <span className="text-[14px] leading-[22px] font-[600]">
          {user.personnel_class || ''}
        </span>
        <Badge
          status="success"
          text={
            <span className="text-[14px] leading-[22px] font-[600]">
              {user?.status || ''}
            </span>
          }
        />
      </div>

      <Progress percent={20} showInfo={false} />

      {items.map((item, index) => (
        <div className="flex items-center gap-[8px]" key={index}>
          {item.icon}
          <span className="text-[14px] leading-[22px] font-[600]">
            {item.label}
          </span>
        </div>
      ))}
    </Card>
  )
}

export default ProfileOverview
