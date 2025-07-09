import { convertRelativeTime } from '@/libs/utils'
import { Notification } from '@/types/notification'
import NotificationItem from './NotificationItem'

const SystemNotificationList = ({
  notifications,
  groupedNotifications,
  handleClick,
}: {
  notifications: Notification[]
  groupedNotifications: Record<string, Notification[]>
  handleClick: (item: Notification) => void
  importantNotifications: Notification[]
  groupedImportantNotifications: Record<string, Notification[]>
}) => (
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

const ImportantNoticeList = ({
  importantNotifications,
  groupedImportantNotifications,
  handleClick,
}: {
  importantNotifications: Notification[]
  groupedImportantNotifications: Record<string, Notification[]>
  handleClick: (item: Notification) => void
}) => (
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

const AllListData = ({
  groupedNotifications,
  groupedImportantNotifications,
}: {
  groupedNotifications: Record<string, Notification[]>
  groupedImportantNotifications: Record<string, Notification[]>
}) =>
  Object.entries({
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

const AllList = ({
  allListData,
  handleClick,
}: {
  allListData: Record<string, Notification[]>
  handleClick: (item: Notification) => void
}) => (
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

export { AllList, ImportantNoticeList, SystemNotificationList }
