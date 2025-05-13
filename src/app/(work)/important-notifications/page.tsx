import { getImportantNotificationNotHidden, getMe } from '@/libs/data'
import INotificationCards from './components/INotificationCards'
import ImportantNotificationHeader from './components/ImportantNotificationHeader'

const ImportantNotificationsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) => {
  const user = await getMe()
  const params = await searchParams

  const query = new URLSearchParams()
  if (params.page) query.set('page', params.page.toString())
  if (params.per_page) query.set('per_page', params.per_page.toString())
  if (params.search) query.set('search', params.search.toString())

  const notifications = await getImportantNotificationNotHidden(
    query.toString(),
  )

  return (
    <>
      <ImportantNotificationHeader user={user} />
      <div className="h-[calc(100vh-89px)] overflow-y-auto bg-[#F6F6F6] p-[16px]">
        <INotificationCards items={notifications} />
      </div>
    </>
  )
}

export default ImportantNotificationsPage
