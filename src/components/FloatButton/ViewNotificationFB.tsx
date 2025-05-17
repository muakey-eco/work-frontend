'use client'

import { useAsyncEffect } from '@/libs/hook'
import { convertRelativeTime, randomColor } from '@/libs/utils'
import { BellFilled, CloseOutlined } from '@ant-design/icons'
import { Avatar, Button, FloatButton, Popover, Tabs } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import {
  getImportantNotificationsAction,
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

const groupByDate = (notifications: Notification[] = []) => {
  const groups: Record<string, Notification[]> = {}

  notifications?.forEach((item) => {
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
      'group flex w-full items-start gap-[12px] !px-6 py-2 !text-[14px] !text-[#000] hover:bg-[#F5FCFF]',
      item.seen === 0 && '!bg-[#E6F4FF]',
    )}
    href={item?.link || ''}
    onClick={onClick}
  >
    <div className={'flex h-[40px] w-[40px] items-center justify-center'}>
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
        <p
          className={clsx('!line-clamp-1 text-[14px]', {
            'font-[600]': item.seen === 0,
          })}
        >
          {item.title}
        </p>
        {item.seen === 0 && (
          <div className="size-[10px] rounded-full bg-[#1677ff]" />
        )}
      </div>
      <p
        className={clsx(
          '!line-clamp-1 text-[12px]',
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
      </div>
    </div>
  </Link>
)

const ViewNotificationFB: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [importantNotifications, setImportantNotifications] = useState<any>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [notificationsWithNotRead, setNotificationsWithNotRead] =
    useState<any[]>()

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

  useAsyncEffect(async () => {
    try {
      const res = await getImportantNotificationsAction()
      setImportantNotifications(res.data || [])
    } catch {
      setImportantNotifications([])
    }
  }, [])

  useEffect(() => {
    setNotificationsWithNotRead(
      notifications?.filter((notify: any) => notify?.new === 1),
    )
  }, [notifications])

  const groupedNotifications = useMemo(
    () => groupByDate(notifications),
    [notifications],
  )
  const groupedImportantNotifications = useMemo(
    () => groupByDate(importantNotifications),
    [importantNotifications],
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

  const systemNotificationList = (
    <div className="scrollbar-hide !h-[664px] overflow-y-auto">
      {notifications.length === 0 ? (
        <div className="!h-[664px] py-4 text-center text-sm text-gray-400">
          Không có thông báo nào
        </div>
      ) : (
        Object.entries(groupedNotifications).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center py-2 ps-7 pe-6 !text-[12px] text-gray-500">
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

  const importantNoticeList = (
    <div className="scrollbar-hide z-100 !h-[664px] overflow-y-auto">
      {importantNotifications.length === 0 ? (
        <div className="!h-[664px] py-4 text-center text-sm text-gray-400">
          Không có thông báo nào
        </div>
      ) : (
        Object.entries(groupedImportantNotifications).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center py-2 ps-7 pe-6 !text-[12px] text-gray-500">
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

  const allListData = Object.entries({
    ...groupedNotifications,
    ...groupedImportantNotifications,
  }).reduce(
    (acc, [date]) => {
      acc[date] = [
        ...(groupedNotifications[date] || []),
        ...(groupedImportantNotifications[date] || []),
      ]
      return acc
    },
    {} as Record<string, Notification[]>,
  )

  const allList = (
    <div className="scrollbar-hide z-100 !h-[664px] overflow-y-auto">
      {Object.keys(allListData).length === 0 ? (
        <div className="!h-[664px] py-4 text-center text-sm text-gray-400">
          Không có thông báo nào
        </div>
      ) : (
        Object.entries(allListData).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center py-2 ps-7 pe-6 !text-[12px] text-gray-500">
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

  const popoverContent = (
    <div className="!z-1000 !h-[664x] !w-[549px] overflow-y-auto !rounded-3xl !pt-5">
      <div className="flex items-center justify-between px-6">
        <span className="text-lg font-semibold">Thông báo</span>
        <Button
          type="text"
          onClick={() => setOpen(false)}
          className="cursor-pointer items-center text-2xl text-gray-400 hover:text-gray-600"
          style={{ lineHeight: 1 }}
          icon={<CloseOutlined />}
        />
      </div>

      <Tabs
        defaultActiveKey="1"
        tabBarStyle={{
          paddingLeft: 24,
          paddingRight: 24,
          marginBottom: 0,
          fontSize: 14,
        }}
        tabBarExtraContent={{
          right: (
            <div className="absolute bottom-0 left-0 h-[1px] w-full bg-[#f0f0f0]" />
          ),
        }}
        items={[
          {
            key: '1',
            label: `Tất cả (${Object.values(allListData).flat().length})`,
            children: allList,
          },
          {
            key: '2',
            label: `Thông báo từ hệ thống (${notifications.length})`,
            children: systemNotificationList,
          },
          {
            key: '3',
            label: `Thông báo quan trọng (${importantNotifications.length})`,
            children: importantNoticeList,
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
      overlayInnerStyle={{
        padding: 0,
        borderRadius: '24px',
        width: 549,
        marginLeft: -7,
      }}
    >
      <FloatButton
        icon={<BellFilled size={24} />}
        type="primary"
        style={{ bottom: 32, left: 100, width: 52, height: 52, margin: 8 }}
        badge={{
          count: notificationsWithNotRead?.length,
          color: 'red',
          style: {
            fontSize: 14,
            border: 'none',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          },
        }}
        shape="circle"
      />
    </Popover>
  )
}

export default ViewNotificationFB
