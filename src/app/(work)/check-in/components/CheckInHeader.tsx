'use client'

import { Button, Space, TabsProps } from 'antd'
import clsx from 'clsx'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import CheckInFiltered from './CheckInFiltered'

type CheckInHeaderProps = {
  params?: any
  activeKey?: string
}

const CheckInHeader: React.FC<CheckInHeaderProps> = ({ params, activeKey }) => {
  const { type } = params
  const router = useRouter()

  const formTabItems: TabsProps['items'] = [
    {
      label: 'Đăng ký nghỉ',
      key: 'dang-ky-nghi',
    },
    {
      label: 'Sửa giờ vào ra',
      key: 'sua-gio-vao-ra',
    },
    {
      label: 'Đăng ký OT',
      key: 'dang-ky-ot',
    },
    {
      label: 'Đăng ký WFH',
      key: 'dang-ky-wfh',
    },
  ]

  const tableTabItems: TabsProps['items'] = [
    {
      label: 'Tất cả',
      key: 'all',
    },
    {
      label: 'Chưa duyệt',
      key: 'pending',
    },
    {
      label: 'Đã duyệt',
      key: 'approved',
    },
    {
      label: 'Đã hủy',
      key: 'canceled',
    },
  ]

  const items = type === 'form-request' ? formTabItems : tableTabItems

  return (
    <div
      className={clsx('bg-[#fff] px-[16px] pt-[16px]', {
        'pb-[16px]': type === 'none',
      })}
    >
      <div className="flex items-center justify-between text-[20px]">
        <span className="leading-[28px] font-[500]">
          {type !== 'none'
            ? type === 'form-request'
              ? 'Yêu cầu'
              : 'Lịch sử yêu cầu'
            : 'Chấm công'}
        </span>
        {type !== 'none' ? (
          type === 'form-request' && (
            <Link href="?table=request-history">
              <Button type="primary">Lịch sử yêu cầu</Button>
            </Link>
          )
        ) : (
          <CheckInFiltered />
        )}
      </div>
      {type !== 'none' && (
        <Space className="mt-[12px]" size="middle">
          {items.map((item) => (
            <div
              key={item.key}
              className={clsx(
                'cursor-pointer border-b-[2px] pb-[8px] text-[13px] leading-[17px] transition-all duration-300 hover:text-[#1677ff]',
                activeKey === item?.key
                  ? 'border-[#1677ff] text-[#1677ff]'
                  : 'border-transparent text-[##00000E0]',
              )}
              onClick={() => {
                router.push(
                  type === 'form-request'
                    ? `?form=${item?.key}`
                    : `?status=${item?.key}`,
                )
              }}
            >
              {item?.label}
            </div>
          ))}
        </Space>
      )}
    </div>
  )
}

export default CheckInHeader
