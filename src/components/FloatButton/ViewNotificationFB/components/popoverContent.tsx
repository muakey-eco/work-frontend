import { Notification } from '@/types/notification'
import { Tabs } from 'antd'
import HeaderViewNotificationFB from './HeaderViewNotificationFB'

const PopoverContent = ({
  setOpen,
  allListData,
  allList,
  notifications,
  systemNotificationList,
  importantNotifications,
  importantNoticeList,
  setNotifications,
}: {
  setOpen: (open: boolean) => void
  allListData: Record<string, Notification[]>
  allList: React.ReactNode
  notifications: Notification[]
  systemNotificationList: React.ReactNode
  importantNotifications: Notification[]
  importantNoticeList: React.ReactNode
  setNotifications: (updater: (prev: any[]) => any[]) => void
}) => (
  <div className="!z-1000 !w-[549px] overflow-y-auto !rounded-3xl !pt-5">
    <HeaderViewNotificationFB
      setOpen={() => setOpen(false)}
      setNotifications={setNotifications}
    />

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

export default PopoverContent
