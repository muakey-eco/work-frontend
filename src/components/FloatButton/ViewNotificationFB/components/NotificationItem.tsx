import { randomColor } from '@/libs/utils'
import { Notification } from '@/types/notification'
import { Avatar } from 'antd'
import clsx from 'clsx'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useState } from 'react'

const NotificationItem = ({
  item,
  onClick,
}: {
  item: Notification
  onClick: () => void
}) => {
  const [imgError, setImgError] = useState(false)
  return (
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
          src={item?.manager?.avatar || undefined}
          style={{
            backgroundColor: randomColor(item?.manager?.full_name || ''),
          }}
          size={32}
          onError={() => false}
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
}

export default NotificationItem
