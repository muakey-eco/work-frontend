import { getMe } from '@/libs/data'
import INotificationCards from './components/INotificationCards'
import ImportantNotificationHeader from './components/ImportantNotificationHeader'

const ImportantNotificationsPage: React.FC = async () => {
  const user = await getMe()

  return (
    <>
      <ImportantNotificationHeader user={user} />
      <div className="h-[calc(100vh-89px)] overflow-y-auto bg-[#F6F6F6] p-[16px]">
        <INotificationCards />
      </div>
    </>
  )
}

export default ImportantNotificationsPage
