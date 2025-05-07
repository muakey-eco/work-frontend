'use client'

import { cn } from '@/lib/utils'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { Divider, Tabs, TabsProps } from 'antd'
import clsx from 'clsx'
import { useRouter } from 'next/navigation'
import React from 'react'

type Tab = {
  items: TabsProps['items']
  className?: TabsProps['className']
  onChangeTab?: (key: string) => void
  extra?: React.ReactNode
  activeKey?: string
}

export type PageHeaderProps = {
  title?: React.ReactNode
  extra?: React.ReactNode
  headerExtra?: React.ReactNode
  tab?: Tab
  activeKey?: string
  onBack?: boolean
  onBackLink?: boolean
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  extra,
  headerExtra,
  tab,
  onBack,
  onBackLink,
}) => {
  const router = useRouter()
  const handleBack = () => {
    router.back()
  }
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b bg-[#fff] px-[24px] pt-[12px]',
        tab?.items ? 'pb-0' : 'pb-[12px]',
      )}
    >
      <div className="flex flex-col">
        <div className="flex items-center justify-between">
          {/* Tên header */}
          <div className="flex items-center gap-[16px]">
            {onBack && (
              <>
                <ArrowLeftOutlined
                  onClick={handleBack}
                  className="cursor-pointer text-[16px]"
                />
              </>
            )}

            {onBackLink && (
              <div>
                <ArrowLeftOutlined
                  onClick={handleBack}
                  className="!cursor-pointer !text-[#1677FF]"
                />
              </div>
            )}
            <span
              className={clsx(
                onBackLink
                  ? 'text-[14px] font-[400] !text-[#1677FF]'
                  : 'text-[20px] font-[500]',
              )}
            >
              {title}
            </span>
          </div>
        </div>
        <div className="flex !w-full items-center">
          {tab?.items && (
            <Tabs
              className={tab?.className}
              tabBarStyle={{ marginBottom: 0 }}
              items={tab?.items}
              onChange={tab?.onChangeTab}
              activeKey={tab?.activeKey}
            />
          )}
          {tab?.extra && (
            <>
              <Divider
                type="vertical"
                className="mx-[32px]! h-[20px] border-r-[#e5e7eb]!"
              />
              {tab?.extra}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-[16px]">
        <div className="flex items-center">{headerExtra}</div>
        <div className="pb-[11px]">{extra}</div>
      </div>
    </div>
  )
}

export default PageHeader
