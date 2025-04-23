'use client'

import { formatCurrency } from '@/lib/utils'
import { randomColor } from '@/libs/utils'
import {
  EditOutlined,
  HeartFilled,
  MailOutlined,
  PhoneOutlined,
} from '@ant-design/icons'

import { Avatar, Badge, Card, message, Progress } from 'antd'
import React, { useMemo, useRef, useState } from 'react'
import animation from './lotties/gold-coin-animation.json'

import { uploadFiles } from '@/libs/data'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import useSeniority from '../../hooks/useSeniority'
import { updateProfileAction } from '../action'

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
  const router = useRouter()
  const [avatar, setAvatar] = useState(user?.avatar)
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleIconClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append('files', file)

    const res = await uploadFiles(formData)

    const avatar = res?.url
    if (avatar) {
      setAvatar(avatar)
      const { message: msg, errors } = await updateProfileAction(user?.id, {
        avatar: avatar,
      })
      if (errors) {
        message.error(msg)
        return
      }
      router.refresh()
      message.success('Cập nhật avatar thành công')
    } else {
      message.error('Cập nhật avatar thất bại')
    }
  }

  return (
    <Card
      classNames={{
        body: '!p-[24px] !space-y-[16px]',
      }}
    >
      <div className="flex justify-center">
        <Badge
          count={
            <EditOutlined
              className="!rounded-full !border-2 !border-white !bg-[#1677FF] !p-[6px] !text-[14px] !text-[#fff]"
              onClick={handleIconClick}
            />
          }
          offset={[-15, 85]} // điều chỉnh vị trí icon
          style={{ cursor: 'pointer' }}
        >
          <Avatar
            className="rounded-full! text-[16px]!"
            size={98}
            shape="circle"
            src={avatar}
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
        </Badge>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
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
          {user?.employee_type
            ? String(
                user.employee_type.charAt(0).toUpperCase() +
                  user.employee_type.slice(1),
              )
            : '--'}
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
