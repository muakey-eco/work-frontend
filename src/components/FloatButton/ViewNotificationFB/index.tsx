'use client'

import {
  getImportantNotificationsAction,
  getNotificationsAction,
  updateNotificationAction,
} from '@/components/WorkLayoutUI/SideBar/action'
import { useAsyncEffect } from '@/libs/hook'
import { Notification } from '@/types/notification'
import { groupByDate } from '@/utils/groupByDate'
import { BellFilled } from '@ant-design/icons'
import { FloatButton, Popover } from 'antd'
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  AllList,
  ImportantNoticeList,
  SystemNotificationList,
} from './components/ListData'
import NotificationSkeleton from './components/NotificationSkeleton'
const NotificationPopoverContent = lazy(
  () => import('./components/popoverContent'),
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

      const [allRes, importantRes] = await Promise.all([
        getNotificationsAction(),
        getImportantNotificationsAction(),
      ])

      setNotifications(Array.isArray(allRes) ? allRes : [])
      setImportantNotifications(
        Array.isArray(importantRes?.data) ? importantRes.data : [],
      )
    } catch (e) {
      setNotifications([])
      setImportantNotifications([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    setNotificationsWithNotRead(
      Array.from(notifications)?.filter((notify: any) => notify?.new === 1),
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

  //Xử lý đánh dấu đã đọc
  const handleClick = useCallback(async (notification: Notification) => {
    if (notification.seen === 1) return
    try {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, seen: 1 } : n)),
      )
      await updateNotificationAction(notification.id, { seen: 1 })
    } catch (err) {
      console.error(err)
    }
  }, [])

  const allListData = useMemo(() => {
    return {
      ...groupedNotifications,
      ...groupedImportantNotifications,
    }
  }, [groupedNotifications, groupedImportantNotifications])

  const allList = useMemo(() => {
    return <AllList allListData={allListData} handleClick={handleClick} />
  }, [allListData, handleClick])

  const systemNotificationList = useMemo(() => {
    return (
      <SystemNotificationList
        notifications={notifications}
        groupedNotifications={groupedNotifications}
        handleClick={handleClick}
        importantNotifications={importantNotifications}
        groupedImportantNotifications={groupedImportantNotifications}
      />
    )
  }, [
    notifications,
    groupedNotifications,
    handleClick,
    importantNotifications,
    groupedImportantNotifications,
  ])

  const importantNoticeList = useMemo(() => {
    return (
      <ImportantNoticeList
        importantNotifications={importantNotifications}
        groupedImportantNotifications={groupedImportantNotifications}
        handleClick={handleClick}
      />
    )
  }, [importantNotifications, groupedImportantNotifications, handleClick])

  return (
    <Popover
      placement="topLeft"
      trigger="click"
      content={
        <Suspense fallback={<NotificationSkeleton />}>
          <NotificationPopoverContent
            notifications={notifications}
            importantNotifications={importantNotifications}
            allListData={allListData}
            allList={allList}
            systemNotificationList={systemNotificationList}
            importantNoticeList={importantNoticeList}
            setOpen={setOpen}
            setNotifications={setNotifications}
          />
        </Suspense>
      }
      open={open}
      onOpenChange={setOpen}
      styles={{
        body: {
          padding: 0,
          borderRadius: '24px',
          width: 549,
          marginLeft: -7,
        },
      }}
    >
      <FloatButton
        icon={<BellFilled size={24} />}
        type="primary"
        style={{ bottom: 32, left: 100, width: 52, height: 52, margin: 8 }}
        badge={{
          count: notificationsWithNotRead?.length || 0,
          color: 'red',
          style: {
            fontSize: 14,
            border: 'none',
            boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
          },
        }}
        shape="circle"
        onClick={() => setOpen(!open)}
      />
    </Popover>
  )
}

export default ViewNotificationFB
