'use client'

import { convertRelativeTime, randomColor } from '@/libs/utils'
import { CloseOutlined } from '@ant-design/icons'
import { App, Avatar, Empty, List, ListProps } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { deleteNotificationAction, updateNotificationAction } from './action'

type NotificationsListProps = ListProps<any> & {}

const NotificationsList: React.FC<NotificationsListProps> = (props) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const { message, modal } = App.useApp()
  const router = useRouter()

  const handleClick = async (notification: any) => {
    try {
      await updateNotificationAction(notification?.id, {
        ...notification,
        seen: 1,
      })
    } catch (error) {
      throw new Error(String(error))
    }
  }

  const handleDelete = async (id: number) => {
    setLoading(true)

    try {
      const { message: msg, errors } = await deleteNotificationAction(id)

      if (errors) {
        message.error(msg)
        setLoading(false)
        return
      }

      message.success('Xóa thành công')
      router.refresh()
      setLoading(false)
    } catch (error) {
      setLoading(false)
      throw new Error(String(error))
    }
  }

  return (
    <List
      renderItem={(item: any) => (
        <List.Item className="p-0!">
          <Link
            className={clsx(
              'group flex w-full items-start gap-[24px] p-[16px] hover:bg-[#F5FCFF] hover:text-[#000]',
              {
                'bg-[#F5FCFF]': item?.seen === 0,
              },
            )}
            href={item?.link || ''}
            onClick={() => handleClick(item)}
          >
            <Avatar
              className="w-[40px]"
              src={item?.manager?.avatar}
              style={{
                backgroundColor: randomColor(String(item?.manager?.full_name)),
              }}
              size={40}
            >
              {String(item?.manager?.full_name).charAt(0).toUpperCase()}
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3
                  className={clsx('text-[16px]', {
                    'font-[600]': item?.seen === 0,
                  })}
                >
                  {item?.title}
                </h3>
                <div className="flex items-center gap-[8px]">
                  <CloseOutlined
                    className="visible cursor-pointer opacity-0 transition-all group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation()
                      e.preventDefault()
                      modal.confirm({
                        title: 'Xác nhận xóa thông báo này?',
                        open,
                        onCancel: () => setOpen(false),
                        onOk: () => handleDelete(item?.id),
                        okButtonProps: {
                          loading,
                        },
                      })
                    }}
                  />
                  {item?.seen === 0 && (
                    <div className="size-[10px] rounded-full bg-[#1677ff]" />
                  )}
                </div>
              </div>
              <p
                className={clsx(
                  'text-[12px]',
                  item?.seen === 0 ? 'text-[#000]' : 'text-[#555]',
                )}
                dangerouslySetInnerHTML={{ __html: item?.message }}
              />
              <div
                className={clsx(
                  'flex items-center justify-between',
                  item?.seen === 0 ? 'text-[#000]' : 'text-[#555]',
                )}
              >
                <span>
                  {dayjs(item?.created_at).format('HH:mm DD/MM/YYYY')}
                </span>
                <span>{convertRelativeTime(item?.created_at)}</span>
              </div>
            </div>
          </Link>
        </List.Item>
      )}
      locale={{
        emptyText: (
          <Empty className="py-[100px]" description="Không có thông báo." />
        ),
      }}
      {...props}
    />
  )
}

export default NotificationsList
