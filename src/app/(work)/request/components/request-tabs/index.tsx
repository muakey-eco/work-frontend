'use client'

import { DropdownProps, Space, SpaceProps } from '@/ui'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

type Tab = {
  key?: string
  label?: string
  children?: Tab[]
}

export type RequestTabsProps = SpaceProps & {
  items?: Tab[]
  activeKey?: string
}

const Dropdown = dynamic(() => import('@/ui').then((ui) => ui.Dropdown), {
  ssr: false,
})

const WorkflowWrap: React.FC<
  DropdownProps & {
    hasChild?: Tab
    children?: React.ReactNode
  }
> = ({ hasChild, children, ...rest }) => {
  if (hasChild) {
    return <Dropdown {...rest}>{children}</Dropdown>
  }

  return children
}

const RequestTabs: React.FC<RequestTabsProps> = ({
  items,
  activeKey,
  ...rest
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleTabClick = (key?: string) => {
    const params = new URLSearchParams(searchParams.toString())

    // Cập nhật status
    if (key) params.set('status', key)
    else params.delete('status')

    router.push(`?${params.toString()}`)
  }

  return (
    <Space size="middle" {...rest}>
      {(items || [])?.map((item) => (
        <WorkflowWrap key={item.label} trigger="click" menu={item?.children}>
          <div
            className={clsx(
              'cursor-pointer border-b-[2px] pb-[8px] text-[13px] leading-[17px] transition-all duration-300 hover:text-[#111]',
              activeKey === item?.key
                ? '!border-[#1677FF] text-[#1677FF]'
                : '!border-transparent text-[#888]',
            )}
            onClick={() => {
              handleTabClick(item?.key)
            }}
          >
            {item?.label}
          </div>
        </WorkflowWrap>
      ))}
    </Space>
  )
}

export default RequestTabs
