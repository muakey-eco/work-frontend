'use client'

import { useAsyncEffect } from '@/libs/hook'
import { convertRelativeTime, randomColor } from '@/libs/utils'
import { BellFilled } from '@ant-design/icons'
import { Avatar, FloatButton, Popover, Tabs } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import {
  getNotificationsAction,
  updateNotificationAction,
} from '../WorkLayoutUI/SideBar/action'

type Notification = {
  id: number
  title: string
  message: string
  created_at: string
  seen: number
  link?: string
  status?: string
  manager?: {
    full_name: string
    avatar?: string
  }
}

const groupByDate = (notifications: Notification[]) => {
  const groups: Record<string, Notification[]> = {}

  notifications.forEach((item) => {
    const dateKey = dayjs(item.created_at).format('DD/MM/YYYY')
    if (!groups[dateKey]) groups[dateKey] = []
    groups[dateKey].push(item)
  })

  return groups
}

const NotificationItem = ({
  item,
  onClick,
}: {
  item: Notification
  onClick: () => void
}) => (
  <Link
    key={item.id}
    className={clsx(
      'group flex w-full items-start gap-[12px] py-2 !text-[14px] !text-[#000] hover:bg-[#F5FCFF]',
      {
        'bg-[#F5FCFF]': item.seen === 0,
      },
    )}
    href={item?.link || ''}
    onClick={onClick}
  >
    <div className="flex h-[40px] w-[40px] items-center justify-center">
      <Avatar
        src={item?.manager?.avatar || ''}
        style={{
          backgroundColor: randomColor(item?.manager?.full_name || ''),
        }}
        size={32}
      >
        {item?.manager?.full_name?.charAt(0).toUpperCase()}
      </Avatar>
    </div>

    <div className="flex-1">
      <div className="flex items-center justify-between">
        <h3
          className={clsx('text-[16px]', {
            'font-[600]': item.seen === 0,
          })}
        >
          {item.title}
        </h3>
        {item.seen === 0 && (
          <div className="size-[10px] rounded-full bg-[#1677ff]" />
        )}
      </div>
      <p
        className={clsx(
          'text-[12px]',
          item.seen === 0 ? 'text-[#000]' : 'text-[#555]',
        )}
        dangerouslySetInnerHTML={{ __html: item.message }}
      />
      <div
        className={clsx(
          'flex items-center justify-between !text-[12px]',
          item.seen === 0 ? 'text-[#000]' : 'text-[#555]',
        )}
      >
        <span>{dayjs(item.created_at).format('HH:mm DD/MM/YYYY')}</span>
        <span>{convertRelativeTime(new Date(item.created_at))}</span>
      </div>
    </div>
  </Link>
)

const ViewNotificationFB: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const router = useRouter()

  useAsyncEffect(async () => {
    try {
      setLoading(true)
      const res = await getNotificationsAction()
      setNotifications(res || [])
    } catch {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  const groupedNotifications = useMemo(
    () => groupByDate(notifications),
    [notifications],
  )

  const handleClick = async (notification: Notification) => {
    if (notification.seen === 1) return
    try {
      await updateNotificationAction(notification.id, {
        ...notification,
        seen: 1,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const allList = (
    <div className="max-h-[817px] overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="py-4 text-center text-sm text-gray-400">
          Không có thông báo nào
        </div>
      ) : (
        Object.entries(groupedNotifications).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center py-2 text-sm text-gray-500">
              <span className="whitespace-nowrap">{date}</span>
              <div className="mx-2 h-[1px] flex-1 self-center bg-gray-300" />
              <span className="whitespace-nowrap">
                {convertRelativeTime(new Date(items[0].created_at))}
              </span>
            </div>
            {items.map((item) => (
              <NotificationItem
                key={item.id}
                item={item}
                onClick={() => handleClick(item)}
              />
            ))}
          </div>
        ))
      )}
    </div>
  )

  const overdueList = (
    <div className="max-h-[817px] overflow-y-auto py-4 text-center text-gray-400">
      Đang cập nhật...
    </div>
  )

  const popoverContent = (
    <div className="w-[549px] !rounded-xl">
      <div className="flex items-center justify-between px-6 py-2">
        <span className="text-lg font-semibold">Thông báo</span>
        <button
          onClick={() => setOpen(false)}
          className="cursor-pointer text-2xl text-gray-400 hover:text-gray-600"
          style={{ lineHeight: 1 }}
        >
          ×
        </button>
      </div>

      <Tabs
        style={{ paddingLeft: '24px', paddingRight: '24px' }}
        defaultActiveKey="1"
        items={[
          {
            key: '1',
            label: `Tất cả (${notifications.length})`,
            children: allList,
          },
          {
            key: '2',
            label: `Thông báo từ hệ thống`,
            children: overdueList,
          },
          {
            key: '3',
            label: `Thông báo quan trọng`,
            children: overdueList,
          },
        ]}
      />
    </div>
  )

  return (
    <Popover
      placement="topLeft"
      trigger="click"
      content={popoverContent}
      open={open}
      onOpenChange={setOpen}
      overlayInnerStyle={{ padding: 0 }}
    >
      <FloatButton
        icon={<BellFilled />}
        type="primary"
        style={{ bottom: 32, left: 90 }}
        badge={{
          count: notifications.filter((n) => n.seen === 0).length,
          color: 'red',
        }}
        shape="circle"
      />
    </Popover>
  )
}

export default ViewNotificationFB
